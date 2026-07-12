-- SLTC records letter grades directly; marks become optional.
ALTER TABLE grades ALTER COLUMN marks DROP NOT NULL;
