use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct MonthlyExpenses {
    pub month: String,
    pub expenses: i32,
}

#[derive(Debug, Serialize)]
pub struct YearOverviewStatistics {
    pub total_expenses_last_year: String,
    pub percent_changes_in_expense_from_last_month: f64,
    pub count_of_repairs_last_year: i64,
    pub percent_changes_in_count_repair_last_month: i64,
    pub count_of_active_repair_requests: i64,
    pub count_changes_in_active_repair_requests_last_week: i64,
    pub count_of_employees: i64,
    pub changes_in_count_of_employees_last_month: i64,
    pub expense_distribution_by_month_last_year: Vec<MonthlyExpenses>,
}
