use axum::{
    extract::{Path, State},
    Json,
};
use sqlx::{query, Postgres, Transaction};
use uuid::Uuid;

use crate::api::{extractor::AuthUser, ApiContext, Error};

use super::{
    models::{Employee, EmployeeBody, EmployeeDetails, EmployeeList, NewEmployee, UpdateEmployee},
    utils::{insert_employee, insert_passport, position_exists},
};

pub async fn add_employee(
    _: AuthUser,
    ctx: State<ApiContext>,
    Json(req): Json<EmployeeBody<NewEmployee>>,
) -> Result<Json<EmployeeBody<Employee>>, Error> {
    if !position_exists(&ctx.db, req.employee.position_id).await? {
        return Err(Error::PositionNotFound);
    }

    let passport_id = insert_passport(
        &ctx.db,
        req.employee.passport_series,
        req.employee.passport_number,
    )
    .await?;

    let employee_id = insert_employee(&ctx.db, &req.employee, passport_id).await?;

    Ok(Json(EmployeeBody {
        employee: Employee {
            id: employee_id,
            first_name: req.employee.first_name.clone(),
            last_name: req.employee.last_name.clone(),
            middle_name: req.employee.middle_name.clone(),
            email: req.employee.email.clone(),
            phone: req.employee.phone.clone(),
            gender: req.employee.gender.clone(),
            position_id: req.employee.position_id,
            passport_id,
        },
    }))
}

pub async fn get_all_employees(
    _: AuthUser,
    ctx: State<ApiContext>,
) -> Result<Json<EmployeeList>, Error> {
    let db_employees = query!(
        r#"
        SELECT
            e.id,
            e.first_name,
            e.last_name,
            e.middle_name,
            e.email,
            e.phone,
            e.gender::text,
            p.name AS position_name,
            p.salary::text AS position_salary,
            ps.series AS passport_series,
            ps.number AS passport_number
        FROM
            employee e
        JOIN
            position_at_work p ON e.position_id = p.id
        JOIN
            passport ps ON e.passport_id = ps.id
        "#
    )
    .fetch_all(&ctx.db)
    .await?;

    let employees = db_employees
        .into_iter()
        .map(|employee| EmployeeDetails {
            id: employee.id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            middle_name: employee.middle_name,
            email: employee.email.unwrap_or("".to_string()),
            phone: employee.phone.unwrap_or("".to_string()),
            gender: employee.gender.unwrap_or("".to_string()),
            position_name: employee.position_name,
            position_salary: employee.position_salary.unwrap_or("Не указано".to_string()),
            passport_series: employee.passport_series,
            passport_number: employee.passport_number,
        })
        .collect();

    Ok(Json(EmployeeList { employees }))
}

pub async fn get_employee(
    _: AuthUser,
    ctx: State<ApiContext>,
    Path(id): Path<Uuid>,
) -> Result<Json<EmployeeDetails>, Error> {
    let optional_employee = query!(
        r#"
        SELECT
            e.id,
            e.first_name,
            e.last_name,
            e.middle_name,
            e.email,
            e.phone,
            e.gender::text,
            p.name AS position_name,
            p.salary::text AS position_salary,
            ps.series AS passport_series,
            ps.number AS passport_number
        FROM
            employee e
        JOIN
            position_at_work p ON e.position_id = p.id
        JOIN
            passport ps ON e.passport_id = ps.id
        WHERE
            e.id = $1
        "#,
        id
    )
    .fetch_optional(&ctx.db)
    .await?;

    let employee = match optional_employee {
        Some(employee) => employee,
        None => return Err(Error::NotFound),
    };

    Ok(Json(EmployeeDetails {
        id: employee.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        middle_name: employee.middle_name,
        email: employee.email.unwrap_or("".to_string()),
        phone: employee.phone.unwrap_or("".to_string()),
        gender: employee.gender.unwrap_or("".to_string()),
        position_name: employee.position_name,
        position_salary: employee.position_salary.unwrap_or("Не указано".to_string()),
        passport_series: employee.passport_series,
        passport_number: employee.passport_number,
    }))
}

pub async fn update_employee(
    user: AuthUser,
    ctx: State<ApiContext>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateEmployee>,
) -> Result<Json<EmployeeDetails>, Error> {
    query!(
        r#"
        UPDATE employee
        SET
            first_name = COALESCE($1, first_name),
            last_name = COALESCE($2, last_name),
            middle_name = COALESCE($3, middle_name),
            email = COALESCE($4, email),
            phone = COALESCE($5, phone),
            position_id = COALESCE($6, position_id)
        WHERE
            id = $7
        "#,
        payload.first_name,
        payload.last_name,
        payload.middle_name,
        payload.email,
        payload.phone,
        payload.position_id,
        id
    )
    .execute(&ctx.db)
    .await?;

    get_employee(user, ctx, Path(id)).await
}

pub async fn delete_employee(
    _: AuthUser,
    ctx: State<ApiContext>,
    Path(id): Path<Uuid>,
) -> Result<(), Error> {
    let mut transaction = ctx.db.begin().await?;

    let rows_affected_committee = query!(
        r#"
        DELETE FROM committee_employee
        WHERE employee_id = $1
        "#,
        id
    )
    .execute(&mut *transaction)
    .await?
    .rows_affected();

    let rows_affected_employee = query!(
        r#"
        DELETE FROM employee
        WHERE id = $1
        "#,
        id
    )
    .execute(&mut *transaction)
    .await?
    .rows_affected();

    if rows_affected_committee == 0 && rows_affected_employee == 0 {
        transaction.rollback().await?;
        return Err(Error::EmployeeNotFound);
    } else {
        transaction.commit().await?;
    }

    Ok(())
}
