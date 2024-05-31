use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct UserBody<T> {
    pub user: T,
}

#[derive(serde::Deserialize)]
pub struct NewUser {
    pub email: String,
    pub password: String,
    pub employee_id: Option<Uuid>,
}

#[derive(serde::Deserialize)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[derive(serde::Deserialize, Default, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct UpdateUser {
    pub email: Option<String>,
    pub password: Option<String>,
    pub employee_id: Option<Uuid>,
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserResponse {
    pub token: String,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct UserAuthResponse {
    pub token: String,
}
