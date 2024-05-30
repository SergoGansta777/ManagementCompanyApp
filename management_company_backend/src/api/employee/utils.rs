use sqlx::{query_scalar, PgPool};
use uuid::Uuid;

use crate::api::Error;

use super::models::NewEmployee;

pub async fn position_exists(pool: &PgPool, position_id: Uuid) -> Result<bool, Error> {
    let exists: Option<bool> = query_scalar!(
        r#"
        SELECT EXISTS(SELECT 1 FROM position_at_work WHERE id = $1)
        "#,
        position_id
    )
    .fetch_optional(pool)
    .await?
    .unwrap_or(None);

    Ok(exists.unwrap_or(false))
}

pub async fn insert_passport(pool: &PgPool, series: i32, number: i32) -> Result<Uuid, Error> {
    let passport_id = query_scalar!(
        r#"
        INSERT INTO passport (series, number)
        VALUES ($1, $2)
        returning id
        "#,
        series,
        number
    )
    .fetch_one(pool)
    .await?;

    Ok(passport_id)
}

pub async fn insert_employee(
    pool: &PgPool,
    new_employee: &NewEmployee,
    passport_id: Uuid,
) -> Result<Uuid, Error> {
    let employee_id = query_scalar!(
        r#"
        INSERT INTO employee (last_name, first_name, middle_name, passport_id, position_id, gender, phone, email)
        VALUES ($1, $2, $3, $4, $5, ($6::text)::gender_enum, $7, ($8::text)::domain_email)
        returning id
        "#,
        new_employee.last_name,
        new_employee.first_name,
        new_employee.middle_name,
        passport_id,
        new_employee.position_id,
        new_employee.gender,
        new_employee.phone,
        new_employee.email
    )
    .fetch_one(pool)
    .await?;

    Ok(employee_id)
}
