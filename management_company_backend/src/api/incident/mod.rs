use axum::{routing::get, Router};
use controllers::{add_incident, get_all_incidents};

use super::ApiContext;

mod controllers;
mod models;

pub(crate) fn router() -> Router<ApiContext> {
    Router::new().route("/api/incidents", get(get_all_incidents).post(add_incident))
    // .route(
    //     "/api/employee/:id",
    //     get(get_employee)
    //         .put(update_employee)
    //         .delete(delete_employee),
    // )
}
