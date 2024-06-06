use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize, Type)]
#[sqlx(type_name = "repair_type", rename_all = "lowercase")]
pub enum RepairType {
    Scheduled,
    Emergency,
}

impl RepairType {
    pub fn to_string(&self) -> String {
        match self {
            RepairType::Emergency => "Аварийный".to_string(),
            RepairType::Scheduled => "Плановый".to_string(),
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Repair {
    pub id: Uuid,
    pub started_at: DateTime<Utc>,
    pub ended_at: Option<DateTime<Utc>>,
    pub repair_type: String,
    pub status: String,
    pub description: String,
    pub building_address: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RepairList {
    pub repairs: Vec<Repair>,
}
