CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS passport (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    series integer NOT NULL CHECK(series > 999 AND series < 10000), -- 4-digit number
    number integer NOT NULL CHECK(number > 99999 AND number < 1000000) -- 6-digit number
);

CREATE TABLE IF NOT EXISTS position_at_work (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    name varchar(50) NOT NULL,
    salary money NOT NULL
);

DO $$
BEGIN
    BEGIN
        CREATE TYPE gender_enum AS ENUM ('female', 'male');
    EXCEPTION
        WHEN duplicate_object THEN
            -- Do nothing, type already exists
    END;
END $$;

DO $$
BEGIN
    BEGIN
        CREATE DOMAIN domain_email AS citext
        CHECK(
           VALUE ~ '^\S+@\S+\.\S+$' -- Simple regex to validate emails
        );
    EXCEPTION
        WHEN duplicate_object THEN
            -- Do nothing, domain already exists
    END;
END $$;

CREATE TABLE IF NOT EXISTS employee (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    last_name varchar(50) NOT NULL,
    first_name varchar(50) NOT NULL,
    middle_name varchar(50),
    passport_id uuid REFERENCES passport(id),
    position_id uuid REFERENCES position_at_work(id),
    gender gender_enum,
    phone varchar(30),
    email domain_email
);

CREATE TABLE IF NOT EXISTS committee (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    name varchar(50) NOT NULL,
    description text,
    start_date date NOT NULL,
    end_date date CHECK(start_date <= end_date)
);

CREATE TABLE IF NOT EXISTS committee_employee (
    committee_id uuid REFERENCES committee(id),
    employee_id uuid REFERENCES employee(id),
    PRIMARY KEY (committee_id, employee_id)
);

CREATE TABLE IF NOT EXISTS address (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    country varchar(60),
    region varchar(60),
    city varchar(60),
    street varchar(60)
);

CREATE TABLE IF NOT EXISTS building (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    committee_id uuid REFERENCES committee(id),
    address_id uuid REFERENCES address(id),
    number integer NOT NULL,
    construction_date date NOT NULL,
    number_of_floors smallint NOT NULL CHECK(number_of_floors > 0)
);

CREATE TABLE IF NOT EXISTS owner (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    last_name varchar(50) NOT NULL,
    first_name varchar(50) NOT NULL,
    middle_name varchar(50),
    passport_id uuid REFERENCES passport(id),
    phone varchar(30)
);

CREATE TABLE IF NOT EXISTS apartment (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    building_id uuid REFERENCES building(id),
    owner_id uuid REFERENCES owner(id),
    number integer NOT NULL,
    floor smallint NOT NULL CHECK(floor > 0),
    square_metres real
);

CREATE TABLE IF NOT EXISTS incident_type (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    name varchar(150) NOT NULL
);

DO $$
BEGIN
    BEGIN
        CREATE TYPE incident_status AS ENUM ('reported', 'in_progress', 'resolved', 'closed', 'cancelled');
    EXCEPTION
        WHEN duplicate_object THEN
            -- Do nothing, type already exists
    END;
END $$;

CREATE TABLE IF NOT EXISTS incident (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    building_id uuid REFERENCES building(id),
    reported_at timestamp WITH time ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at timestamp WITH TIME ZONE CHECK(reported_at <= resolved_at),
    status incident_status NOT NULL,
    description text,
    incident_type_id uuid REFERENCES incident_type(id)
);

CREATE TABLE IF NOT EXISTS incident_apartment (
    incident_id uuid REFERENCES incident(id),
    apartment_id uuid REFERENCES apartment(id)
);

DO $$
BEGIN
    BEGIN
        CREATE TYPE repair_type AS ENUM ('scheduled', 'emergency');
    EXCEPTION
        WHEN duplicate_object THEN
            -- Do nothing, type already exists
    END;
END $$;

CREATE TABLE IF NOT EXISTS repair (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    incident_id uuid, -- Made optional by allowing NULL values
    started_at timestamp WITH time ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at timestamp WITH time ZONE NULL,
    type repair_type NOT NULL,
    CHECK(started_at <= ended_at)
);

DO $$
BEGIN
    BEGIN
        CREATE TYPE financial_operation_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'payment', 'adjustment');
    EXCEPTION
        WHEN duplicate_object THEN
            -- Do nothing, type already exists
    END;
END $$;

CREATE TABLE IF NOT EXISTS financial_operation (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    amount money NOT NULL,
    happen_at timestamp WITH time ZONE DEFAULT CURRENT_TIMESTAMP,
    description text,
    employee_id uuid REFERENCES employee(id),
    repair_id uuid REFERENCES repair(id),
    type financial_operation_type NOT NULL
);

COMMIT TRANSACTION;
