use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Address {
    pub country: String,
    pub region: String,
    pub city: String,
    pub street: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Building {
    pub id: Uuid,
    pub number: i32,
    pub number_of_floors: i16,
    pub address: Address,
    pub constructed_date: NaiveDate,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BuildingList {
    pub buildings: Vec<Building>,
}
