use axum::{routing::get, Router};
use controllers::get_all_repairs;

use super::ApiContext;

mod controllers;
mod models;

pub(crate) fn router() -> Router<ApiContext> {
    Router::new().route("/api/repairs", get(get_all_repairs))
}
