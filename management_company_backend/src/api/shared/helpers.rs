use chrono::{DateTime, NaiveDate, TimeZone, Utc};

pub fn naive_date_to_utc_datetime(date: NaiveDate) -> DateTime<Utc> {
    Utc.from_utc_datetime(&date.and_hms_opt(0, 0, 0).expect("Invalid date"))
}
