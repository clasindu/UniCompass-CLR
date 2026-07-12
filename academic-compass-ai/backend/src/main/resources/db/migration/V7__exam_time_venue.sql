-- Add optional exam time and venue to exams
ALTER TABLE exams ADD COLUMN exam_time TIME;
ALTER TABLE exams ADD COLUMN venue VARCHAR(150);
