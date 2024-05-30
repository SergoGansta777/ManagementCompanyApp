ALTER TABLE financial_operation
DROP CONSTRAINT financial_operation_employee_id_fkey;

ALTER TABLE financial_operation
ADD CONSTRAINT financial_operation_employee_id_fkey
FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE SET NULL;
