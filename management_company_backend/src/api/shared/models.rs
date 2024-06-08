use chrono::NaiveDate;
use serde::{de, Deserialize, Deserializer, Serialize};

const DATE_FORMAT: &str = "%Y-%m-%d";

fn parse_date<'de, D>(deserializer: D) -> Result<NaiveDate, D::Error>
where
    D: Deserializer<'de>,
{
    let s: String = Deserialize::deserialize(deserializer)?;
    NaiveDate::parse_from_str(&s, DATE_FORMAT).map_err(de::Error::custom)
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QueryTimeDiapasonParams {
    #[serde(deserialize_with = "parse_date")]
    pub start_date: NaiveDate,
    #[serde(deserialize_with = "parse_date")]
    pub end_date: NaiveDate,
}
