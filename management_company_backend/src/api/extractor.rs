use crate::api::{error::Error, ApiContext};
use axum::{
    async_trait,
    extract::{FromRef, FromRequestParts},
    http::{header::AUTHORIZATION, request::Parts, HeaderValue},
};
use hmac::{Hmac, Mac};
use jwt::{SignWithKey, Token, VerifyWithKey};
use serde::{Deserialize, Serialize};
use sha2::Sha384;
use time::OffsetDateTime;
use uuid::Uuid;

const DEFAULT_SESSION_LENGTH: time::Duration = time::Duration::weeks(1);

const SCHEME_PREFIX: &str = "Bearer ";

pub struct AuthUser {
    pub user_id: Uuid,
}

pub struct MaybeAuthUser(pub Option<AuthUser>);

#[derive(Serialize, Deserialize)]
struct AuthUserClaims {
    user_id: Uuid,
    exp: i64,
}

impl AuthUser {
    pub fn to_jwt(&self, ctx: &ApiContext) -> String {
        let hmac = Hmac::<Sha384>::new_from_slice(ctx.config.hmac_key.as_bytes())
            .expect("HMAC-SHA-384 can accept any key length");

        AuthUserClaims {
            user_id: self.user_id,
            exp: (OffsetDateTime::now_utc() + DEFAULT_SESSION_LENGTH).unix_timestamp(),
        }
        .sign_with_key(&hmac)
        .expect("HMAC signing should be infallible")
    }

    fn from_authorization(ctx: &ApiContext, auth_header: &HeaderValue) -> Result<Self, Error> {
        let auth_header = auth_header.to_str().map_err(|_| {
            log::debug!("Authorization header is not UTF-8");
            Error::Unauthorized
        })?;

        if !auth_header.starts_with(SCHEME_PREFIX) {
            log::debug!(
                "Authorization header is using the wrong scheme: {:?}",
                auth_header
            );
            return Err(Error::Unauthorized);
        }

        let token = &auth_header[SCHEME_PREFIX.len()..];

        let jwt =
            Token::<jwt::Header, AuthUserClaims, _>::parse_unverified(token).map_err(|e| {
                log::debug!(
                    "Failed to parse Authorization header {:?} : {}",
                    auth_header,
                    e
                );
                Error::Unauthorized
            })?;

        let hmac = Hmac::<Sha384>::new_from_slice(ctx.config.hmac_key.as_bytes())
            .expect("HMAC-SHA-384 can accept any key length");

        let jwt = jwt.verify_with_key(&hmac).map_err(|e| {
            log::debug!("JWT failed to verify: {}", e);
            Error::Unauthorized
        })?;

        let (_header, claims) = jwt.into();

        if claims.exp < OffsetDateTime::now_utc().unix_timestamp() {
            log::debug!("Token expired");
            return Err(Error::Unauthorized);
        }

        Ok(Self {
            user_id: claims.user_id,
        })
    }
}

impl MaybeAuthUser {}

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
    ApiContext: FromRef<S>,
{
    type Rejection = Error;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let ctx: ApiContext = ApiContext::from_ref(state);

        let auth_header = parts
            .headers
            .get(AUTHORIZATION)
            .ok_or(Error::Unauthorized)?;

        Self::from_authorization(&ctx, auth_header)
    }
}

#[async_trait]
impl<S> FromRequestParts<S> for MaybeAuthUser
where
    S: Send + Sync,
    ApiContext: FromRef<S>,
{
    type Rejection = Error;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let ctx: ApiContext = ApiContext::from_ref(state);

        Ok(Self(
            parts
                .headers
                .get(AUTHORIZATION)
                .map(|auth_header| AuthUser::from_authorization(&ctx, auth_header))
                .transpose()?,
        ))
    }
}
