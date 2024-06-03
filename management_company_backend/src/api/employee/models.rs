use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct EmployeeBody<T> {
    pub employee: T,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmployeeDetailsList {
    pub employees: Vec<EmployeeDetails>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmployeeDetails {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub middle_name: Option<String>,
    pub email: String,
    pub phone: String,
    pub gender: String,
    pub position_name: String,
    pub position_salary: String,
    pub passport_series: i32,
    pub passport_number: i32,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewEmployee {
    pub first_name: String,
    pub last_name: String,
    pub middle_name: Option<String>,
    pub email: String,
    pub phone: String,
    pub gender: String,
    pub position_id: Uuid,
    pub passport_series: i32,
    pub passport_number: i32,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateEmployee {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub middle_name: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub gender: Option<String>,
    pub position_id: Option<Uuid>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Employee {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub middle_name: Option<String>,
    pub email: String,
    pub phone: String,
    pub gender: String,
    pub position_id: Uuid,
    pub passport_id: Uuid,
}
