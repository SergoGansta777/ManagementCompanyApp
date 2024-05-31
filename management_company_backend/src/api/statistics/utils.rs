use sqlx::{query_as_unchecked, query_scalar, PgPool};

use crate::api::{statistics::models::MonthlyExpenses, Error};

use super::models::YearOverviewStatistics;

pub async fn build_year_overview_statistics(
    pool: &PgPool,
) -> Result<YearOverviewStatistics, Error> {
    let total_expenses_last_year = get_total_expenses_last_year(pool).await?;
    let percent_changes_in_expense_from_last_month =
        get_percent_changes_in_expense_from_last_month(pool).await?;
    let count_of_repairs_last_year = get_count_of_repairs_last_year(pool).await?;
    let percent_changes_in_count_repair_last_month =
        get_percent_changes_in_count_repair_last_month(pool).await?;
    let count_of_active_repair_requests = get_count_of_count_repair_requests(pool).await?;
    let count_changes_in_active_repair_requests_last_week =
        get_count_changes_in_active_repair_requests_last_week(pool).await?;
    let count_of_employees = get_count_of_employees(pool).await?;
    let changes_in_count_of_employees_last_month =
        get_changes_in_count_of_employees_last_month(pool).await?;
    let expense_distribution_by_month_last_year =
        get_expence_distribution_by_month_last_year(pool).await?;

    Ok(YearOverviewStatistics {
        total_expenses_last_year,
        percent_changes_in_expense_from_last_month,
        count_of_repairs_last_year,
        percent_changes_in_count_repair_last_month,
        count_of_active_repair_requests,
        count_changes_in_active_repair_requests_last_week,
        count_of_employees,
        changes_in_count_of_employees_last_month,
        expense_distribution_by_month_last_year,
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

/// Рассчитать процент изменения расходов за текущий месяц по сравнению с прошлым месяцем.
async fn get_percent_changes_in_expense_from_last_month(pool: &PgPool) -> Result<f64, Error> {
    let changes_in_percents = query_scalar!(
        r#"
        WITH current_month AS (
            SELECT SUM(amount) AS expenses
            FROM financial_operation
            WHERE type IN ('withdrawal', 'payment', 'adjustment')
              AND date_trunc('month', happen_at) = date_trunc('month', NOW())
        ),
        previous_month AS (
            SELECT SUM(amount) AS expenses
            FROM financial_operation
            WHERE type IN ('withdrawal', 'payment', 'adjustment')
              AND date_trunc('month', happen_at) = date_trunc('month', NOW() - INTERVAL '1 month')
        )
        SELECT
            CASE
                WHEN previous_month.expenses::numeric::int = 0 THEN NULL
                ELSE (current_month.expenses - previous_month.expenses) / previous_month.expenses * 100
            END AS percent_change
        FROM
            current_month, previous_month;
    "#
    )
    .fetch_one(pool)
    .await?;

    Ok(changes_in_percents.unwrap_or(0.0)) // Default to 0.0 if NULL
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

/// Рассчитать процент изменения количества завершенных ремонтов за текущий месяц по сравнению с прошлым месяцем.
async fn get_percent_changes_in_count_repair_last_month(pool: &PgPool) -> Result<i64, Error> {
    let changes_in_percents = query_scalar!(
        r#"
        WITH current_month AS (
            SELECT COUNT(*) AS repairs
            FROM repair
            WHERE ended_at IS NOT NULL
              AND date_trunc('month', started_at) = date_trunc('month', NOW())
        ),
        previous_month AS (
            SELECT COUNT(*) AS repairs
            FROM repair
            WHERE ended_at IS NOT NULL
              AND date_trunc('month', started_at) = date_trunc('month', NOW() - INTERVAL '1 month')
        )
        SELECT
            CASE
                WHEN previous_month.repairs = 0 THEN NULL
                ELSE (current_month.repairs - previous_month.repairs) / previous_month.repairs * 100
            END AS percent_change
        FROM
            current_month, previous_month;
    "#
    )
    .fetch_one(pool)
    .await?;

    Ok(changes_in_percents.unwrap_or(0))
}

/// Получить количество текущих активных заявок на ремонт.
async fn get_count_of_count_repair_requests(pool: &PgPool) -> Result<i64, Error> {
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

/// Подсчитать изменение количества активных заявок на ремонт за последнюю неделю.
async fn get_count_changes_in_active_repair_requests_last_week(
    pool: &PgPool,
) -> Result<i64, Error> {
    let changes_in_percents = query_scalar!(
        r#"
        WITH current_week AS (
            SELECT COUNT(*) AS active_incidents
            FROM incident
            WHERE status IN ('reported', 'in_progress')
              AND reported_at >= NOW() - INTERVAL '1 week'
        ),
        previous_week AS (
            SELECT COUNT(*) AS active_incidents
            FROM incident
            WHERE status IN ('reported', 'in_progress')
              AND reported_at BETWEEN NOW() - INTERVAL '2 weeks' AND NOW() - INTERVAL '1 week'
        )
        SELECT
            CASE
                WHEN previous_week.active_incidents = 0 THEN NULL
                ELSE (current_week.active_incidents - previous_week.active_incidents)
            END AS change_in_active_incidents
        FROM
            current_week, previous_week;
    "#
    )
    .fetch_one(pool)
    .await?;

    Ok(changes_in_percents.unwrap_or(0)) // Default to 0 if NULL
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

/// Рассчитать изменение количества сотрудников за последний месяц.
async fn get_changes_in_count_of_employees_last_month(pool: &PgPool) -> Result<i64, Error> {
    let changes_in_percents = query_scalar!(
        r#"
        WITH current_month AS (
            SELECT COUNT(*) AS employees
            FROM employee
            WHERE date_trunc('month', NOW()) = date_trunc('month', NOW())
        ),
        previous_month AS (
            SELECT COUNT(*) AS employees
            FROM employee
            WHERE date_trunc('month', NOW() - INTERVAL '1 month') = date_trunc('month', NOW() - INTERVAL '1 month')
        )
        SELECT
            (current_month.employees - previous_month.employees) AS change_in_employees
        FROM
            current_month, previous_month;
    "#
    )
    .fetch_one(pool)
    .await?;

    Ok(changes_in_percents.unwrap())
}

/// Рассчитать изменение количества сотрудников за последний месяц.
async fn get_expence_distribution_by_month_last_year(
    pool: &PgPool,
) -> Result<Vec<MonthlyExpenses>, Error> {
    let distributions = query_as_unchecked!(
        MonthlyExpenses,
        r#"
        SELECT
            TO_CHAR(happen_at, 'Month')::text AS month,
            SUM(amount)::Numeric::Int AS expenses
        FROM
            financial_operation
        WHERE
            type IN ('withdrawal', 'payment', 'adjustment')
            AND happen_at >= NOW() - INTERVAL '1 year'
        GROUP BY
            TO_CHAR(happen_at, 'Month'),
            EXTRACT(MONTH FROM happen_at)
        ORDER BY
            EXTRACT(MONTH FROM happen_at);
            "#
    )
    .fetch_all(pool)
    .await?;

    Ok(distributions)
}
