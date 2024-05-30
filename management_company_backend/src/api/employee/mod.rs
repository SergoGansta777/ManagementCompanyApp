use crate::api::ApiContext;
use axum::routing::{get, post};
use axum::Router;
use controllers::{
    add_employee, delete_employee, get_all_employees, get_employee, update_employee,
};

mod controllers;
mod models;
mod utils;

pub(crate) fn router() -> Router<ApiContext> {
    Router::new()
        .route("/api/employees", post(add_employee).get(get_all_employees))
        .route(
            "/api/employee/:id",
            get(get_employee)
                .put(update_employee)
                .delete(delete_employee),
        )
}
