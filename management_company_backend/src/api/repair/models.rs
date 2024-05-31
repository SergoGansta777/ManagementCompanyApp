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

#[derive(Serialize, Deserialize)]
pub struct Repair {
    pub id: Uuid,
    pub started_at: DateTime<Utc>,
    pub ended_at: Option<DateTime<Utc>>,
    pub repair_type: RepairType,
    pub incident_id: Option<Uuid>,
}

#[derive(Serialize)]
pub struct RepairList {
    pub repairs: Vec<Repair>,
}
