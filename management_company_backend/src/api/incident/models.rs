use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use uuid::Uuid;

#[derive(Serialize)]
pub struct Address {
    pub country: String,
    pub region: String,
    pub city: String,
    pub street: String,
}

#[derive(Serialize)]
pub struct Building {
    pub id: Uuid,
    pub number: i32,
    pub number_of_floors: i16,
    pub address: Address,
}

#[derive(Serialize)]
pub struct IncidentType {
    pub id: Uuid,
    pub name: String,
}

#[derive(Serialize)]
pub struct IncidentDetails {
    pub id: Uuid,
    pub building: Building,
    pub reported_at: DateTime<Utc>,
    pub resolved_at: Option<DateTime<Utc>>,
    pub status: String,
    pub description: Option<String>,
    pub incident_type: IncidentType,
}

#[derive(Serialize)]
pub struct IncidentList {
    pub incidents: Vec<IncidentDetails>,
}

#[derive(Debug, Deserialize, Serialize, Type)]
#[sqlx(type_name = "incident_status", rename_all = "lowercase")]
pub enum IncidentStatus {
    Reported,
    InProgress,
    Resolved,
    Closed,
    Cancelled,
}

#[derive(Deserialize)]
pub struct NewIncident {
    pub building_id: Uuid,
    pub resolved_at: Option<DateTime<Utc>>,
    pub status: IncidentStatus,
    pub description: Option<String>,
    pub incident_type_id: Uuid,
}

#[derive(Serialize)]
pub struct Incident {
    pub id: Uuid,
    pub building_id: Uuid,
    pub reported_at: DateTime<Utc>,
    pub resolved_at: Option<DateTime<Utc>>,
    pub status: IncidentStatus,
    pub description: Option<String>,
    pub incident_type_id: Uuid,
}
