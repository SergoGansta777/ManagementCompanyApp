use axum::{extract::State, Json};
use sqlx::query;

use crate::api::{ApiContext, Error};

use super::models::{Address, Building, BuildingList};

pub async fn get_all_buildings(State(ctx): State<ApiContext>) -> Result<Json<BuildingList>, Error> {
    let db_buildings = query!(
        r#"
        SELECT
            b.id,
            b.number,
            b.construction_date,
            b.number_of_floors,
            a.id AS address_id,
            a.country,
            a.region,
            a.city,
            a.street
        FROM
            building b
        JOIN
            address a ON b.address_id = a.id
        "#
    )
    .fetch_all(&ctx.db)
    .await?;

    let buildings = db_buildings
        .into_iter()
        .map(|row| Building {
            id: row.id,
            number: row.number,
            number_of_floors: row.number_of_floors,
            constructed_date: row.construction_date,
            address: Address {
                country: row.country.unwrap_or_default(),
                region: row.region.unwrap_or_default(),
                city: row.city.unwrap_or_default(),
                street: row.street.unwrap_or_default(),
            },
        })
        .collect();

    Ok(Json(BuildingList { buildings }))
}
