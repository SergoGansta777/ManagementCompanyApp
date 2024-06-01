use axum::{routing::get, Router};
use controllers::{get_building_statistics, get_year_overview_statistics};

use super::ApiContext;

mod controllers;
mod models;
mod utils;

pub(crate) fn router() -> Router<ApiContext> {
    Router::new()
        .route(
            "/api/statistics/year_overview",
            get(get_year_overview_statistics),
        )
        .route("/api/statistics/building/:id", get(get_building_statistics))
}
