use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MonthlyExpenses {
    pub name: String,
    pub total: i32,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct YearOverviewStatistics {
    pub total_expenses_last_year: String,
    pub percent_changes_in_expense_from_last_year: String,
    pub count_of_repairs_last_year: i64,
    pub percent_changes_in_count_repair_last_year: String,
    pub count_of_active_repair_requests: i64,
    pub percent_changes_in_active_repair_requests_last_year: String,
    pub count_of_employees: i64,
    pub count_new_employee_last_year: i64,
    pub expense_distribution_by_month_last_year: Vec<MonthlyExpenses>,
    pub total_incidents_last_year: i64,
    pub top_5_incident_types_last_year: Vec<IncidentTypeInfo>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IncidentTypeInfo {
    pub id: Uuid,
    pub name: String,
    pub count: i64,
    pub percentage: String,
}
