use axum::{extract::State, Json};
use sqlx::query;

use crate::api::{employee::position::models::Position, extractor::AuthUser, ApiContext, Error};

use super::models::PositionList;

pub async fn get_all_positions(
    _: AuthUser,
    ctx: State<ApiContext>,
) -> Result<Json<PositionList>, Error> {
    let db_positions = query!(
        r#"
        SELECT
            id,
            name,
            salary::text AS salary
        FROM
            position_at_work
        "#
    )
    .fetch_all(&ctx.db)
    .await?;

    let positions = db_positions
        .into_iter()
        .map(|position| Position {
            id: position.id,
            name: position.name,
            salary: position.salary.unwrap_or_else(|| "Не указано".to_string()),
        })
        .collect();

    Ok(Json(PositionList { positions }))
}
