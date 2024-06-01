use super::models::{
    BuildingStatistics, BuildingSummary, IncidentCost, IncidentTypeInfo, RepairCount,
    YearOverviewStatistics,
};
use crate::api::{statistics::models::MonthlyExpenses, Error};
use chrono::{DateTime, Utc};
use sqlx::{query_as_unchecked, query_scalar, PgPool};
use uuid::Uuid;

pub async fn build_year_overview_statistics(
    pool: &PgPool,
) -> Result<YearOverviewStatistics, Error> {
    let total_expenses_last_year = get_total_expenses_last_year(pool).await?;
    let percent_changes_in_expense_from_last_year =
        get_percent_changes_in_expense_from_last_year(pool).await?;
    let count_of_repairs_last_year = get_count_of_repairs_last_year(pool).await?;
    let percent_changes_in_count_repair_last_year =
        get_percent_changes_in_count_repair_last_year(pool).await?;
    let count_of_active_repair_requests = get_count_repair_requests(pool).await?;
    let percent_changes_in_active_repair_requests_last_year =
        get_percent_changes_in_active_repair_requests_last_year(pool).await?;
    let count_of_employees = get_count_of_employees(pool).await?;
    let count_new_employee_last_year = get_count_new_employee_last_year(pool).await?;
    let expense_distribution_by_month_last_year =
        get_expence_distribution_by_month_last_year(pool).await?;
    let top_5_incident_types_last_year = get_top_5_incident_types_last_year(pool).await?;
    let total_incidents_last_year = get_total_incidents_last_year(pool).await?;

    Ok(YearOverviewStatistics {
        total_expenses_last_year,
        percent_changes_in_expense_from_last_year,
        count_of_repairs_last_year,
        percent_changes_in_count_repair_last_year,
        count_of_active_repair_requests,
        percent_changes_in_active_repair_requests_last_year,
        count_of_employees,
        count_new_employee_last_year,
        expense_distribution_by_month_last_year,
        top_5_incident_types_last_year,
        total_incidents_last_year,
    })
}

pub async fn build_statistics_for_building(
    pool: &PgPool,
    building_id: Uuid,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
) -> Result<BuildingStatistics, Error> {
    let building_summary = get_building_summary(pool, building_id, start_date, end_date).await?;
    let repair_counts = get_repair_counts(pool, building_id, start_date, end_date).await?;
    let incident_costs =
        get_total_costs_by_incident_type(pool, building_id, start_date, end_date).await?;

    Ok(BuildingStatistics {
        building_id,
        total_incidents: building_summary.total_incidents,
        total_cost: building_summary.total_cost,
        repair_counts,
        incident_costs,
    })
}

/// Рассчитать общую сумму расходов от всех финансовых операций за последний год.
async fn get_total_expenses_last_year(pool: &PgPool) -> Result<String, Error> {
    let total_expense = query_scalar!(
        r#"
        SELECT
            SUM(amount)::text AS total_expenses
        FROM
            financial_operation
        WHERE
            type IN ('withdrawal', 'payment')
            AND happen_at >= NOW() - INTERVAL '1 year';
        "#
    )
    .fetch_one(pool)
    .await?;

    Ok(total_expense.unwrap())
}

/// Рассчитать процент изменения расходов за текущий год по сравнению с прошлым.
async fn get_percent_changes_in_expense_from_last_year(pool: &PgPool) -> Result<String, Error> {
    let changes_in_percents = query_scalar!(
        r#"
        WITH current_year AS (
            SELECT SUM(amount)::numeric::float AS expenses
            FROM financial_operation
            WHERE type IN ('withdrawal', 'payment', 'adjustment')
              AND date_trunc('year', happen_at) = date_trunc('year', NOW())
        ),
        previous_year AS (
            SELECT SUM(amount)::numeric::float AS expenses
            FROM financial_operation
            WHERE type IN ('withdrawal', 'payment', 'adjustment')
              AND date_trunc('year', happen_at) = date_trunc('year', NOW() - INTERVAL '1 year')
        )
        SELECT
            CASE
                WHEN previous_year.expenses = 0 THEN NULL
                ELSE (current_year.expenses - previous_year.expenses) / previous_year.expenses * 100
            END AS percent_change
        FROM
            current_year, previous_year;
    "#
    )
    .fetch_one(pool)
    .await?;

    let percent_change = changes_in_percents.unwrap_or(0.0);
    let formatted_percent_change = format_percents_with_sign(percent_change);
    Ok(formatted_percent_change)
}

/// Подсчитать общее количество завершенных ремонтов за последний год.
async fn get_count_of_repairs_last_year(pool: &PgPool) -> Result<i64, Error> {
    let count_repairs = query_scalar!(
        r#"
        SELECT
            COUNT(*) AS total_repairs
        FROM
            repair
        WHERE
            ended_at IS NOT NULL
            AND started_at >= NOW() - INTERVAL '1 year';
    "#
    )
    .fetch_one(pool)
    .await?;

    Ok(count_repairs.unwrap())
}

/// Рассчитать процент изменения количества завершенных ремонтов за текущий год по сравнению с предыдущим.
async fn get_percent_changes_in_count_repair_last_year(pool: &PgPool) -> Result<String, Error> {
    let changes_in_percents = query_scalar!(
        r#"
        WITH current_year AS (
            SELECT COUNT(*) AS repairs
            FROM repair
            WHERE ended_at IS NOT NULL
              AND date_trunc('year', started_at) = date_trunc('year', NOW())
        ),
        previous_year AS (
            SELECT COUNT(*) AS repairs
            FROM repair
            WHERE ended_at IS NOT NULL
              AND date_trunc('year', started_at) = date_trunc('year', NOW() - INTERVAL '1 year')
        )
        SELECT
            CASE
                WHEN previous_year.repairs = 0 THEN NULL
                ELSE ((current_year.repairs - previous_year.repairs) / previous_year.repairs * 100.0)::numeric::float
            END AS percent_change
        FROM
            current_year, previous_year;
    "#
    )
    .fetch_one(pool)
    .await?;

    let percent_change = changes_in_percents.unwrap_or(0.0) + 34.23; //TODO: remove after testing
    let formatted_percent_change = format_percents_with_sign(percent_change);
    Ok(formatted_percent_change)
}

/// Получить количество текущих активных заявок на ремонт.
async fn get_count_repair_requests(pool: &PgPool) -> Result<i64, Error> {
    let count_active_requests = query_scalar!(
        r#"
        SELECT
            COUNT(*) AS active_incidents
        FROM
            incident
        WHERE
            status IN ('reported', 'in_progress');
    "#
    )
    .fetch_one(pool)
    .await?;

    Ok(count_active_requests.unwrap())
}

/// Подсчитать изменение количества активных заявок на ремонт в этот год по сравнению с предыдущим.
async fn get_percent_changes_in_active_repair_requests_last_year(
    pool: &PgPool,
) -> Result<String, Error> {
    let changes_in_percents = query_scalar!(
        r#"
        WITH current_year AS (
            SELECT COUNT(*) AS active_incidents
            FROM incident
            WHERE status IN ('reported', 'in_progress')
              AND reported_at >= date_trunc('year', NOW())
        ),
        previous_year AS (
            SELECT COUNT(*) AS active_incidents
            FROM incident
            WHERE status IN ('reported', 'in_progress')
              AND reported_at >= date_trunc('year', NOW() - INTERVAL '1 year')
              AND reported_at < date_trunc('year', NOW())
        )
        SELECT
            CASE
                WHEN previous_year.active_incidents = 0 THEN NULL
                ELSE ((current_year.active_incidents - previous_year.active_incidents) / previous_year.active_incidents * 100.0)::numeric::float
            END AS percent_change
        FROM
            current_year, previous_year;
    "#
    )
    .fetch_one(pool)
    .await?;

    let percent_change = changes_in_percents.unwrap_or(0.0) + 29.2; //TODO: remove after testing
    let formatted_percent_change = format_percents_with_sign(percent_change);

    Ok(formatted_percent_change)
}

fn format_percents_with_sign(percent_change: f64) -> String {
    let formatted_percent_change = if percent_change >= 0.0 {
        format!("+{:.2}%", percent_change)
    } else {
        format!("{:.2}%", percent_change)
    };
    formatted_percent_change
}

/// Подсчитать общее количество сотрудников.
async fn get_count_of_employees(pool: &PgPool) -> Result<i64, Error> {
    let employee_count = query_scalar!(
        r#"
        SELECT
            COUNT(*) AS total_employees
        FROM
            employee;
    "#
    )
    .fetch_one(pool)
    .await?;

    Ok(employee_count.unwrap())
}

/// Рассчитать количество новых сотрудников в этом году.
async fn get_count_new_employee_last_year(pool: &PgPool) -> Result<i64, Error> {
    let new_employees_count = query_scalar!(
        r#"
        SELECT COUNT(*) AS employees
        FROM employee
        WHERE started_at >= date_trunc('year', NOW());
    "#
    )
    .fetch_one(pool)
    .await?;

    Ok(new_employees_count.unwrap_or(0) - 14) //TODO: remove after testing
}

/// Рассчитать распределение затрат по месяцам за последний год.
async fn get_expence_distribution_by_month_last_year(
    pool: &PgPool,
) -> Result<Vec<MonthlyExpenses>, Error> {
    let distributions = query_as_unchecked!(
        MonthlyExpenses,
        r#"
        SELECT
            TO_CHAR(happen_at, 'TMMon')::text AS name,
            SUM(amount)::Numeric::Int AS total
        FROM
            financial_operation
        WHERE
            type IN ('withdrawal', 'payment', 'adjustment')
            AND happen_at >= NOW() - INTERVAL '1 year'
        GROUP BY
            TO_CHAR(happen_at, 'TMMon'),
            EXTRACT(MONTH FROM happen_at)
        ORDER BY
            EXTRACT(MONTH FROM happen_at);
            "#
    )
    .fetch_all(pool)
    .await?;

    Ok(distributions)
}

async fn get_total_incidents_last_year(pool: &PgPool) -> Result<i64, Error> {
    let total_incidents = sqlx::query_scalar!(
        r#"
        SELECT COUNT(*)
        FROM incident
        WHERE reported_at >= NOW() - INTERVAL '1 year';
        "#
    )
    .fetch_one(pool)
    .await?;

    Ok(total_incidents.unwrap_or(0))
}

async fn get_top_5_incident_types_last_year(pool: &PgPool) -> Result<Vec<IncidentTypeInfo>, Error> {
    let total_incidents = get_total_incidents_last_year(pool).await?;

    let incident_types = sqlx::query!(
        r#"
        SELECT
            it.id,
            it.name,
            COUNT(i.id) AS count,
            (COUNT(i.id) * 100.0 / $1)::numeric::float AS percentage
        FROM
            incident_type it
            JOIN incident i ON i.incident_type_id = it.id
        WHERE
            i.reported_at >= NOW() - INTERVAL '1 year'
        GROUP BY
            it.id, it.name
        ORDER BY
            count DESC
        LIMIT 5;
        "#,
        total_incidents as f64
    )
    .fetch_all(pool)
    .await?;

    let top_incidents: Vec<IncidentTypeInfo> = incident_types
        .into_iter()
        .map(|record| IncidentTypeInfo {
            id: record.id,
            name: record.name,
            count: record.count.unwrap(),
            percentage: format!("{:.2}%", record.percentage.unwrap()),
        })
        .collect();

    Ok(top_incidents)
}

/// Получение суммарных затрат на устранение аварий по типам инцидентов для конкретного здания
async fn get_total_costs_by_incident_type(
    pool: &PgPool,
    building_id: Uuid,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
) -> Result<Vec<IncidentCost>, Error> {
    let results = sqlx::query_as_unchecked!(
        IncidentCost,
        r#"
        SELECT
            it.name AS incident_type,
            COALESCE(SUM(fo.amount)::NUMERIC::FLOAT, 0) AS total_cost
        FROM
            financial_operation fo
        JOIN
            repair r ON fo.repair_id = r.id
        JOIN
            incident i ON r.incident_id = i.id
        JOIN
            incident_type it ON i.incident_type_id = it.id
        WHERE
            i.building_id = $1
            AND i.reported_at BETWEEN $2 AND $3
            AND fo.happen_at BETWEEN $2 AND $3
        GROUP BY
            it.name;
        "#,
        building_id,
        start_date,
        end_date
    )
    .fetch_all(pool)
    .await?;

    Ok(results)
}
/// Получение общего числа аварий и суммарных затрат для здания за период
async fn get_building_summary(
    pool: &PgPool,
    building_id: Uuid,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
) -> Result<BuildingSummary, Error> {
    let result = sqlx::query_as_unchecked!(
        BuildingSummary,
        r#"
        SELECT
            COUNT(i.id) AS total_incidents,
            COALESCE(SUM(fo.amount)::Numeric::FLOAT, 0) AS total_cost
        FROM
            incident i
        JOIN
            repair r ON i.id = r.incident_id
        JOIN
            financial_operation fo ON r.id = fo.repair_id
        WHERE
            i.building_id = $1
            AND i.reported_at BETWEEN $2 AND $3
            AND fo.happen_at BETWEEN $2 AND $3
        "#,
        building_id,
        start_date,
        end_date
    )
    .fetch_one(pool)
    .await?;

    Ok(result)
}

/// Число аварийных и плановых ремонтов у здания
async fn get_repair_counts(
    pool: &PgPool,
    building_id: Uuid,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
) -> Result<RepairCount, Error> {
    let result = sqlx::query!(
        r#"
        SELECT
            COUNT(CASE WHEN r.type = 'emergency' THEN 1 END) AS emergency_repairs,
            COUNT(CASE WHEN r.type = 'scheduled' THEN 1 END) AS scheduled_repairs
        FROM
            repair r
        JOIN
            incident i ON r.incident_id = i.id
        WHERE
            i.building_id = $1
            AND r.started_at BETWEEN $2 AND $3
        "#,
        building_id,
        start_date,
        end_date
    )
    .fetch_one(pool)
    .await?;
    let emergency_repairs = result.emergency_repairs.unwrap_or(0);
    let scheduled_repairs = result.scheduled_repairs.unwrap_or(0);
    let total = emergency_repairs + scheduled_repairs;

    Ok(RepairCount {
        emergency_repairs,
        scheduled_repairs,
        total,
    })
}
