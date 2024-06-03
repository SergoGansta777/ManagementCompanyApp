-- Migration script to add building_id to repair table and ensure data integrity

BEGIN TRANSACTION;

-- Step 1: Remove incidents without building_id
DELETE FROM incident
WHERE building_id IS NULL;

-- Step 2: Add the building_id column to the repair table
ALTER TABLE repair
ADD COLUMN building_id uuid;

-- Step 3: Update the building_id column for existing repair records
UPDATE repair
SET building_id = i.building_id
FROM incident i
WHERE repair.incident_id = i.id;

-- Step 4: Handle financial operations referencing repairs with NULL building_id
-- This involves updating or deleting financial operations before deleting repairs
-- In this example, we set the financial_operation repair_id to NULL for dependent records
-- Adjust this logic as necessary for your application

UPDATE financial_operation
SET repair_id = NULL
WHERE repair_id IN (SELECT id FROM repair WHERE building_id IS NULL);

-- Step 5: Remove repair records with NULL building_id
DELETE FROM repair
WHERE building_id IS NULL;

-- Step 6: Set NOT NULL constraint and add foreign key constraint
ALTER TABLE repair
ALTER COLUMN building_id SET NOT NULL,
ADD CONSTRAINT fk_building
FOREIGN KEY (building_id)
REFERENCES building (id);

COMMIT TRANSACTION;