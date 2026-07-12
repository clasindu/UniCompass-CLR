-- Day 5: unified booking system — providers + bookings

CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(20) NOT NULL
        CHECK (category IN ('MEDICAL', 'COUNSELING', 'MENTOR', 'FITNESS')),
    name VARCHAR(150) NOT NULL,
    -- for MEDICAL: specialist type; COUNSELING: focus area; MENTOR: field; FITNESS: discipline
    specialty VARCHAR(150) NOT NULL,
    qualification VARCHAR(200),
    bio TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    booking_time TIME,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED'
        CHECK (status IN ('REQUESTED', 'CONFIRMED', 'CANCELLED')),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_providers_category ON providers (category);
CREATE INDEX idx_bookings_user ON bookings (user_id);

-- ===== Seed demo providers =====

-- MEDICAL specialists (dummy consultants)
INSERT INTO providers (category, name, specialty, qualification, bio) VALUES
('MEDICAL', 'Dr. A. Fernando', 'Physician (Internal Medicine)', 'MBBS, MD', 'General adult diseases, diabetes, blood pressure, infections.'),
('MEDICAL', 'Dr. S. Jayawardena', 'Cardiologist', 'MBBS, MD, MRCP', 'Heart and blood vessel diseases.'),
('MEDICAL', 'Dr. N. Perera', 'Neurologist', 'MBBS, MD', 'Brain, nerves, stroke, epilepsy.'),
('MEDICAL', 'Dr. R. Silva', 'Neurosurgeon', 'MBBS, MS', 'Brain and spinal cord surgery.'),
('MEDICAL', 'Dr. K. Bandara', 'Dermatologist', 'MBBS, MD', 'Skin, hair, and nail conditions.'),
('MEDICAL', 'Dr. M. Gunawardena', 'Orthopedic Surgeon', 'MBBS, MS', 'Bones, joints, fractures, sports injuries.'),
('MEDICAL', 'Dr. P. Wijeratne', 'ENT Specialist', 'MBBS, MS', 'Ear, nose, and throat problems.'),
('MEDICAL', 'Dr. L. De Silva', 'Ophthalmologist', 'MBBS, MS', 'Eye diseases and surgery.'),
('MEDICAL', 'Dr. H. Rajapaksha', 'Gynecologist', 'MBBS, MD', 'Women''s reproductive health and pregnancy.'),
('MEDICAL', 'Dr. T. Mendis', 'Obstetrician', 'MBBS, MD', 'Pregnancy and childbirth care.'),
('MEDICAL', 'Dr. C. Alwis', 'Pediatrician', 'MBBS, MD', 'Children''s health.'),
('MEDICAL', 'Dr. D. Senanayake', 'Psychiatrist', 'MBBS, MD', 'Mental health disorders.'),
('MEDICAL', 'Dr. G. Ratnayake', 'Urologist', 'MBBS, MS', 'Urinary tract and male reproductive system.'),
('MEDICAL', 'Dr. F. Ismail', 'Nephrologist', 'MBBS, MD', 'Kidney diseases.'),
('MEDICAL', 'Dr. V. Kumar', 'Gastroenterologist', 'MBBS, MD', 'Stomach, liver, and digestive system.'),
('MEDICAL', 'Dr. B. Dissanayake', 'Pulmonologist', 'MBBS, MD', 'Lung and respiratory diseases.');

-- COUNSELING (BSc Honours in Psychology counselors)
INSERT INTO providers (category, name, specialty, qualification, bio) VALUES
('COUNSELING', 'Ms. I. Weerasinghe', 'Anxiety & Stress', 'BSc Honours in Psychology', 'CBT-based support for anxiety, stress, and panic.'),
('COUNSELING', 'Mr. J. Peiris', 'Depression & Mood', 'BSc Honours in Psychology', 'Support for depression, low mood, and self-esteem.'),
('COUNSELING', 'Ms. N. Fonseka', 'Relationships & Family', 'BSc Honours in Psychology', 'Relationship, family, and interpersonal counseling.'),
('COUNSELING', 'Mr. A. Cooray', 'Addiction & Anger', 'BSc Honours in Psychology', 'Addiction treatment and anger management.'),
('COUNSELING', 'Ms. S. Herath', 'Teen / Child & ADHD', 'BSc Honours in Psychology', 'Teen/child counseling, ADHD, and self-esteem.'),
('COUNSELING', 'Mr. D. Liyanage', 'Sleep & CBT', 'BSc Honours in Psychology', 'Insomnia/sleep, CBT, and general wellbeing.');

-- MENTOR (lecturers, seniors, industry experts)
INSERT INTO providers (category, name, specialty, qualification, bio) VALUES
('MENTOR', 'Dr. R. Amarasinghe', 'University Lecturer — Software Engineering', 'PhD, Computer Science', 'Academic guidance and final year project mentoring.'),
('MENTOR', 'Ms. K. Nawagamuwa', 'Senior Student — HND/Degree', 'Final year undergraduate', 'Peer mentoring, study tips, module guidance.'),
('MENTOR', 'Mr. S. Gupta', 'Industry Expert — Full Stack', 'Senior Software Engineer', 'Career advice, portfolio review, interview prep.'),
('MENTOR', 'Ms. A. Fernando', 'Industry Expert — Data/AI', 'Data Scientist', 'Guidance on data science and AI career paths.');

-- FITNESS (university doctor / sports / gym / physio)
INSERT INTO providers (category, name, specialty, qualification, bio) VALUES
('FITNESS', 'Dr. University Health', 'University Doctor', 'MBBS', 'General campus health advice and referrals.'),
('FITNESS', 'Coach M. Silva', 'Sports Coach', 'BSc Sports Science', 'Sports training, technique, and injury prevention.'),
('FITNESS', 'Coach T. Perera', 'Gym Coach', 'Certified Personal Trainer', 'Strength training, fitness plans, nutrition basics.'),
('FITNESS', 'Ms. R. Jayasuriya', 'Physiotherapist', 'BSc Physiotherapy', 'Physiotherapy and rehabilitation.');
