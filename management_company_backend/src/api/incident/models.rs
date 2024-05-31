use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use uuid::Uuid;

use crate::api::building::models::Building;

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
    pub status: IncidentStatus,
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
    #[sqlx(rename = "in_progress")]
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

#[derive(Serialize)]
pub struct IncidentTypeList {
    pub incident_types: Vec<IncidentType>,
}
