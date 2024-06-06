use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use uuid::Uuid;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IncidentType {
    pub id: Uuid,
    pub name: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IncidentDetails {
    pub id: Uuid,
    pub building_address: String,
    pub reported_at: DateTime<Utc>,
    pub resolved_at: Option<DateTime<Utc>>,
    pub status: String,
    pub description: Option<String>,
    pub incident_type_name: String,
}

#[derive(Serialize)]
pub struct IncidentList {
    pub incidents: Vec<IncidentDetails>,
}

#[derive(Debug, Deserialize, Serialize, Type)]
#[sqlx(type_name = "incident_status", rename_all = "camelCase")]
pub enum IncidentStatus {
    Reported,
    #[sqlx(rename = "in_progress")]
    InProgress,
    Resolved,
    Closed,
    Cancelled,
}

impl IncidentStatus {
    pub fn to_string(&self) -> String {
        match self {
            Self::Closed => "Закрыто".to_string(),
            Self::Cancelled => "Отменено".to_string(),
            Self::InProgress => "В процессе ремонта".to_string(),
            Self::Reported => "Обработка заявки".to_string(),
            Self::Resolved => "Исправлено".to_string(),
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewIncident {
    pub building_id: Uuid,
    pub resolved_at: Option<DateTime<Utc>>,
    pub status: IncidentStatus,
    pub description: Option<String>,
    pub incident_type_id: Uuid,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
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
#[serde(rename_all = "camelCase")]
pub struct IncidentTypeList {
    pub incident_types: Vec<IncidentType>,
}
