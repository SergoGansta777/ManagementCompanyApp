use axum::{extract::State, Json};

use crate::api::{
    employee::utils::employee_exists, extractor::AuthUser, ApiContext, Error, Result,
};

use super::{
    models::{LoginUser, NewUser, UpdateUser, UserAuthResponse, UserBody, UserResponse},
    utils::{hash_password, verify_password},
};

pub async fn create_user(
    ctx: State<ApiContext>,
    Json(req): Json<UserBody<NewUser>>,
) -> Result<Json<UserBody<UserAuthResponse>>> {
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
        user: UserAuthResponse {
            token: AuthUser { user_id }.to_jwt(&ctx),
        },
    }))
}

pub async fn login_user(
    ctx: State<ApiContext>,
    Json(req): Json<UserBody<LoginUser>>,
) -> Result<Json<UserBody<UserAuthResponse>>> {
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
        user: UserAuthResponse {
            token: AuthUser { user_id: user.id }.to_jwt(&ctx),
        },
    }))
}

pub async fn get_current_user(
    auth_user: AuthUser,
    ctx: State<ApiContext>,
) -> Result<Json<UserBody<UserResponse>>> {
    let optional_user = sqlx::query!(
        r#"
        select u.email, e.first_name, e.last_name
        from user_account u
        inner join employee e on u.employee_id = e.id
        where u.id = $1"#,
        auth_user.user_id
    )
    .fetch_optional(&ctx.db)
    .await?;

    match optional_user {
        Some(user) => Ok(Json(UserBody {
            user: UserResponse {
                token: auth_user.to_jwt(&ctx),
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        })),
        None => Err(Error::Unauthorized.into()),
    }
}

pub async fn update_user(
    auth_user: AuthUser,
    ctx: State<ApiContext>,
    Json(req): Json<UserBody<UpdateUser>>,
) -> Result<()> {
    if req.user == UpdateUser::default() {
        return Ok(());
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
            returning email, employee_id
        "#,
        req.user.email,
        req.user.employee_id,
        password_hash,
        auth_user.user_id
    )
    .fetch_one(&ctx.db)
    .await?;

    Ok(())
}
