use axum::{routing::get, Router};
use controllers::get_all_positions;

use crate::api::ApiContext;
mod controllers;
mod models;

pub(crate) fn router() -> Router<ApiContext> {
    Router::new().route("/api/positions", get(get_all_positions))
}
