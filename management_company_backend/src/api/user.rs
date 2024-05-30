use anyhow::Context;
use argon2::password_hash::SaltString;
use argon2::{Argon2, PasswordHash};
use axum::extract::State;
use axum::routing::{get, post};
use axum::{Json, Router};
use serde::{Deserialize, Serialize};
use sqlx::{query_scalar, PgPool};
use uuid::Uuid;

use crate::api::error::Error;
use crate::api::extractor::AuthUser;
use crate::api::{ApiContext, Result};

pub(crate) fn router() -> Router<ApiContext> {
    Router::new()
        .route("/api/users", post(create_user))
        .route("/api/users/login", post(login_user))
        .route("/api/user/me", get(get_current_user).put(update_user))
}

#[derive(Serialize, Deserialize)]
struct UserBody<T> {
    user: T,
}

#[derive(serde::Deserialize)]
struct NewUser {
    email: String,
    password: String,
    employee_id: Option<Uuid>,
}

#[derive(serde::Deserialize)]
struct LoginUser {
    email: String,
    password: String,
}

#[derive(serde::Deserialize, Default, PartialEq, Eq)]
#[serde(default)]
struct UpdateUser {
    email: Option<String>,
    password: Option<String>,
    employee_id: Option<Uuid>,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct UserResponse {
    token: String,
}

async fn employee_exists(pool: &PgPool, employee_id: Uuid) -> Result<bool, Error> {
    let exists: Option<bool> = query_scalar!(
        r#"
        SELECT EXISTS(SELECT 1 FROM employee WHERE id = $1)
        "#,
        employee_id
    )
    .fetch_optional(pool)
    .await?
    .unwrap_or(None);

    Ok(exists.unwrap_or(false))
}

async fn create_user(
    ctx: State<ApiContext>,
    Json(req): Json<UserBody<NewUser>>,
) -> Result<Json<UserBody<UserResponse>>> {
    if req.user.employee_id.is_none()
        || !employee_exists(&ctx.db, req.user.employee_id.unwrap()).await?
    {
        return Err(Error::EmployeeNotFound.into());
    }

    let password_hash = hash_password(req.user.password).await?;
    let user_id = sqlx::query_scalar!(
        r#"
        insert into user_account (email, password_hash, employee_id)
        values (($1::text)::domain_email, $2, $3)
        returning id
        "#,
        req.user.email,
        password_hash,
        req.user.employee_id
    )
    .fetch_one(&ctx.db)
    .await?;

    Ok(Json(UserBody {
        user: UserResponse {
            token: AuthUser { user_id }.to_jwt(&ctx),
        },
    }))
}

async fn login_user(
    ctx: State<ApiContext>,
    Json(req): Json<UserBody<LoginUser>>,
) -> Result<Json<UserBody<UserResponse>>> {
    let optional_user = sqlx::query!(
        r#"
            select id, email, password_hash
            from user_account where email = $1
        "#,
        req.user.email,
    )
    .fetch_optional(&ctx.db)
    .await?;

    let user = match optional_user {
        Some(user) => user,
        None => return Err(Error::UserNotFound.into()),
    };

    verify_password(req.user.password, user.password_hash).await?;

    Ok(Json(UserBody {
        user: UserResponse {
            token: AuthUser { user_id: user.id }.to_jwt(&ctx),
        },
    }))
}

async fn get_current_user(
    auth_user: AuthUser,
    ctx: State<ApiContext>,
) -> Result<Json<UserBody<UserResponse>>> {
    let optional_user = sqlx::query!(
        r#"select email from user_account where id = $1"#,
        auth_user.user_id
    )
    .fetch_optional(&ctx.db)
    .await?;

    match optional_user {
        Some(_) => Ok(Json(UserBody {
            user: UserResponse {
                token: auth_user.to_jwt(&ctx),
            },
        })),
        None => Err(Error::Unauthorized.into()),
    }
}

async fn update_user(
    auth_user: AuthUser,
    ctx: State<ApiContext>,
    Json(req): Json<UserBody<UpdateUser>>,
) -> Result<Json<UserBody<UserResponse>>> {
    if req.user == UpdateUser::default() {
        return get_current_user(auth_user, ctx).await;
    }

    let password_hash = if let Some(password) = req.user.password {
        Some(hash_password(password).await?)
    } else {
        None
    };

    let _ = sqlx::query!(
        r#"
            update user_account
            set email = coalesce($1, user_account.email),
                employee_id = coalesce($2, user_account.employee_id),
                password_hash = coalesce($3, user_account.password_hash)
            where id = $4
            returning email
        "#,
        req.user.email,
        req.user.employee_id,
        password_hash,
        auth_user.user_id
    )
    .fetch_one(&ctx.db)
    .await?;

    Ok(Json(UserBody {
        user: UserResponse {
            token: auth_user.to_jwt(&ctx),
        },
    }))
}

async fn hash_password(password: String) -> Result<String> {
    tokio::task::spawn_blocking(move || -> Result<String> {
        let salt = SaltString::generate(rand::thread_rng());
        Ok(
            PasswordHash::generate(Argon2::default(), password, salt.as_salt())
                .map_err(|e| anyhow::anyhow!("failed to generate password hash: {}", e))?
                .to_string(),
        )
    })
    .await
    .context("panic in generating password hash")?
}

async fn verify_password(password: String, password_hash: String) -> Result<()> {
    tokio::task::spawn_blocking(move || -> Result<()> {
        let hash = PasswordHash::new(&password_hash)
            .map_err(|e| anyhow::anyhow!("invalid password hash: {}", e))?;

        hash.verify_password(&[&Argon2::default()], password)
            .map_err(|e| match e {
                argon2::password_hash::Error::Password => Error::Unauthorized,
                _ => anyhow::anyhow!("failed to verify password hash: {}", e).into(),
            })
    })
    .await
    .context("panic in verifying password hash")?
}
