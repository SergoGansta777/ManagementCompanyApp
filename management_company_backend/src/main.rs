use anyhow::Context;
use clap::Parser;
use sqlx::postgres::PgPoolOptions;

use config::Config;
use tracing_subscriber::fmt::format::FmtSpan;

mod api;
mod config;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();

    tracing_subscriber::fmt()
        .with_span_events(FmtSpan::FULL)
        .init();

    let config = Config::parse();

    let db = PgPoolOptions::new()
        .max_connections(50)
        .connect(&config.database_url)
        .await
        .context("Could not connect to database url")?;

    sqlx::migrate!().run(&db).await?;

    api::serve(config, db).await?;

    Ok(())
}
