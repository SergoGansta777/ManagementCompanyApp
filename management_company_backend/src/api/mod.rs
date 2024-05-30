use std::{
    net::{Ipv4Addr, SocketAddr},
    sync::Arc,
    time::Duration,
};

use anyhow::Context;
use axum::{http::header::AUTHORIZATION, Router};
use sqlx::PgPool;
use tokio::net::TcpListener;
use tower_http::{
    catch_panic::CatchPanicLayer,
    compression::CompressionLayer,
    cors::{Any, CorsLayer},
    sensitive_headers::SetSensitiveHeadersLayer,
    timeout::TimeoutLayer,
    trace::TraceLayer,
};

pub use error::Error;

mod employee;
mod error;
mod extractor;
mod incident;
mod user;

use crate::config::Config;

#[derive(Clone)]
pub(crate) struct ApiContext {
    config: Arc<Config>,
    db: PgPool,
}

pub async fn serve(config: Config, db: PgPool) -> anyhow::Result<()> {
    let api_context = ApiContext {
        config: Arc::new(config),
        db,
    };

    let app = api_router(api_context);

    let addr = SocketAddr::from((Ipv4Addr::UNSPECIFIED, 8080));
    let listener = TcpListener::bind(addr).await?;
    axum::serve(listener, app)
        .await
        .context("error running HTTP server")
}

pub type Result<T, E = Error> = std::result::Result<T, E>;

fn api_router(api_context: ApiContext) -> Router {
    Router::new()
        .merge(user::router())
        .merge(employee::router())
        .merge(incident::router())
        .route("/health", axum::routing::get(|| async { "healthy" }))
        .layer((
            SetSensitiveHeadersLayer::new([AUTHORIZATION]),
            CompressionLayer::new(),
            TraceLayer::new_for_http().on_failure(()),
            TimeoutLayer::new(Duration::from_secs(30)),
            CatchPanicLayer::new(),
        ))
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        )
        .with_state(api_context)
}
