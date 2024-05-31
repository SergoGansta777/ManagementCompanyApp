use axum::{extract::State, Json};

use crate::api::{extractor::AuthUser, ApiContext, Error};

use super::{models::YearOverviewStatistics, utils::build_year_overview_statistics};

pub async fn get_year_overview_statistics(
    _: AuthUser,
    ctx: State<ApiContext>,
) -> Result<Json<YearOverviewStatistics>, Error> {
    let statistics = build_year_overview_statistics(&ctx.db).await?;
    Ok(Json(statistics))
}
