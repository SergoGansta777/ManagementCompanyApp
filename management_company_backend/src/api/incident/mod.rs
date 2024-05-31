use axum::{routing::get, Router};
use controllers::{add_incident, get_all_incident_types, get_all_incidents};

use super::ApiContext;

mod controllers;
pub mod models;

pub(crate) fn router() -> Router<ApiContext> {
    Router::new()
        .route("/api/incidents", get(get_all_incidents).post(add_incident))
        .route("/api/incident/types", get(get_all_incident_types))
}
