use axum::{
    routing::{get, post},
    Router,
};
use controllers::{create_user, get_current_user, login_user, update_user};

use super::ApiContext;

mod controllers;
mod models;
pub mod utils;

pub(crate) fn router() -> Router<ApiContext> {
    Router::new()
        .route("/api/users", post(create_user))
        .route("/api/users/login", post(login_user))
        .route("/api/user/me", get(get_current_user).put(update_user))
}
