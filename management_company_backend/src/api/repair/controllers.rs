use axum::{extract::State, Json};
use sqlx::query;

use crate::api::{extractor::AuthUser, incident::models::IncidentStatus, ApiContext, Error};

use super::models::{Repair, RepairList, RepairType};

pub async fn get_all_repairs(
    _: AuthUser,
    State(ctx): State<ApiContext>,
) -> Result<Json<RepairList>, Error> {
    let db_repairs = query!(
        r#"
        SELECT
            r.id,
            r.started_at,
            r.ended_at,
            r.type AS "repair_type: RepairType",
            i.id AS incident_id,
            i.building_id,
            i.reported_at,
            i.resolved_at,
            i.status as "status: IncidentStatus",
            i.description,
            i.incident_type_id
        FROM
            repair r
        LEFT JOIN
            incident i ON r.incident_id = i.id
        "#
    )
    .fetch_all(&ctx.db)
    .await?;

    let repairs = db_repairs
        .into_iter()
        .map(|row| Repair {
            id: row.id,
            started_at: row.started_at.unwrap(),
            ended_at: row.ended_at,
            repair_type: row.repair_type,
            incident_id: row.incident_id,
        })
        .collect();

    Ok(Json(RepairList { repairs }))
}
