CREATE INDEX IF NOT EXISTS idx_user_account_email ON user_account(email);

CREATE INDEX IF NOT EXISTS idx_incident_reported_at ON incident(reported_at);
CREATE INDEX IF NOT EXISTS idx_incident_status ON incident(status);
CREATE INDEX IF NOT EXISTS idx_incident_building_id ON incident(building_id);

CREATE INDEX IF NOT EXISTS idx_financial_operation_employee_id ON financial_operation(employee_id);

CREATE INDEX IF NOT EXISTS idx_repair_started_at ON repair(started_at);
CREATE INDEX IF NOT EXISTS idx_repair_type ON repair(type);

CREATE INDEX IF NOT EXISTS idx_employee_email ON employee(email);
