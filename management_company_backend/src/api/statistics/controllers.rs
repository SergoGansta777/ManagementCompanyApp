use axum::{
    extract::{Path, Query, State},
    Json,
};
use uuid::Uuid;

use crate::api::{extractor::AuthUser, ApiContext, Error};

use super::{
    models::{BuildingStatistics, QueryTimeDiapasonParams, YearOverviewStatistics},
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
    Path(id): Path<Uuid>,
    Query(params): Query<QueryTimeDiapasonParams>,
) -> Result<Json<BuildingStatistics>, Error> {
    let report =
        build_statistics_for_building(&ctx.db, id, params.start_date, params.end_date).await?;
    Ok(Json(report))
}
