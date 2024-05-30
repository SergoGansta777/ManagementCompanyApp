CREATE TABLE IF NOT EXISTS user_account (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    email domain_email UNIQUE NOT NULL,
    password_hash varchar(255) NOT NULL,
    employee_id uuid REFERENCES employee(id)
);
