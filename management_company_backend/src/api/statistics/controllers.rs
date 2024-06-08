use axum::{
    extract::{Query, State},
    Json,
};

use crate::api::{
    extractor::AuthUser,
    shared::{helpers::naive_date_to_utc_datetime, models::QueryTimeDiapasonParams},
    ApiContext, Error,
};

use super::{
    models::{SummaryStatistics, YearOverviewStatistics},
    utils::{build_statistics_for_building, build_year_overview_statistics},
};

pub async fn get_year_overview_statistics(
    _: AuthUser,
    ctx: State<ApiContext>,
) -> Result<Json<YearOverviewStatistics>, Error> {
    let statistics = build_year_overview_statistics(&ctx.db).await?;
    Ok(Json(statistics))
}

pub async fn get_building_statistics(
    _: AuthUser,
    ctx: State<ApiContext>,
    Query(params): Query<QueryTimeDiapasonParams>,
) -> Result<Json<SummaryStatistics>, Error> {
    let report = build_statistics_for_building(
        &ctx.db,
        naive_date_to_utc_datetime(params.start_date),
        naive_date_to_utc_datetime(params.end_date),
    )
    .await?;
    Ok(Json(report))
}
