use axum::{routing::get, Router};
use controllers::get_all_buildings;

use super::ApiContext;

mod controllers;
pub mod models;

pub(crate) fn router() -> Router<ApiContext> {
    Router::new().route("/api/buildings", get(get_all_buildings))
}
