use axum::{
    extract::{Query, State},
    Json,
};
use chrono::{DateTime, TimeZone, Utc};

use crate::api::{extractor::AuthUser, ApiContext, Error};

use super::{
    models::{QueryTimeDiapasonParams, SummaryStatistics, YearOverviewStatistics},
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
    let start_date_time = params.start_date.and_hms(0, 0, 0);
    let end_date_time = params.end_date.and_hms(0, 0, 0);

    let start_date_utc: DateTime<Utc> = Utc.from_utc_datetime(&start_date_time);
    let end_date_utc: DateTime<Utc> = Utc.from_utc_datetime(&end_date_time);

    let report = build_statistics_for_building(&ctx.db, start_date_utc, end_date_utc).await?;
    Ok(Json(report))
}
