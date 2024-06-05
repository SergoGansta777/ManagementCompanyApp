use axum::{extract::State, Json};
use sqlx::query;
use uuid::Uuid;

use crate::api::{extractor::AuthUser, incident::models::IncidentStatus, ApiContext, Error};

use super::models::{
    Incident, IncidentDetails, IncidentList, IncidentType, IncidentTypeList, NewIncident,
};

pub async fn get_all_incidents(
    _: AuthUser,
    ctx: State<ApiContext>,
) -> Result<Json<IncidentList>, Error> {
    let db_incidents = query!(
        r#"
        SELECT
            i.id,
            i.reported_at,
            i.resolved_at,
            i.status as "status: IncidentStatus",
            i.description,
            it.name AS "incident_type_name: String",
            b.id AS "building_id: Uuid",
            b.number AS "building_number: i32",
            b.number_of_floors AS "building_number_of_floors: i16",
            b.construction_date,
            a.country AS "address_country!: String",
            a.region AS "address_region!: String",
            a.city AS "address_city!: String",
            a.street AS "address_street!: String"
        FROM
            incident i
        JOIN
            incident_type it ON i.incident_type_id = it.id
        JOIN
            building b ON i.building_id = b.id
        JOIN
            address a ON b.address_id = a.id
        "#
    )
    .fetch_all(&ctx.db)
    .await?;

    let incidents = db_incidents
        .into_iter()
        .map(|incident| IncidentDetails {
            id: incident.id,
            reported_at: incident.reported_at.unwrap_or_default(),
            resolved_at: incident.resolved_at,
            status: incident.status.to_string(),
            description: incident.description,
            incident_type_name: incident.incident_type_name,
            building_address: format!(
                "{}, {}, {}, дом {}",
                incident.address_region,
                incident.address_city,
                incident.address_street,
                incident.building_number
            ),
        })
        .collect();

    Ok(Json(IncidentList { incidents }))
}

pub async fn add_incident(
    _: AuthUser,
    State(ctx): State<ApiContext>,
    Json(new_incident): Json<NewIncident>,
) -> Result<Json<Incident>, Error> {
    let incident = sqlx::query_as_unchecked!(
        Incident,
        r#"
        INSERT INTO incident (building_id, resolved_at, status, description, incident_type_id)
        VALUES ($1, $2,  $3::incident_status, $4, $5)
        RETURNING id, building_id, reported_at, resolved_at, status AS "status: _", description, incident_type_id
        "#,
        new_incident.building_id,
        new_incident.resolved_at,
        new_incident.status as IncidentStatus,
        new_incident.description,
        new_incident.incident_type_id
    )
    .fetch_one(&ctx.db)
    .await?;

    Ok(Json(incident))
}

pub async fn get_all_incident_types(
    _: AuthUser,
    State(ctx): State<ApiContext>,
) -> Result<Json<IncidentTypeList>, Error> {
    let db_incident_types = sqlx::query_as!(
        IncidentType,
        r#"
        SELECT id, name
        FROM incident_type
        "#
    )
    .fetch_all(&ctx.db)
    .await?;

    Ok(Json(IncidentTypeList {
        incident_types: db_incident_types,
    }))
}
