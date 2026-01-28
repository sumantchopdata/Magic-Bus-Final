/*
  # Create Student Registration Schema

  1. New Tables
    - `student_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `student_registration`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references student_profiles)
      - Personal details: first_name, last_name, email, phone, date_of_birth, gender, address
      - Status tracking fields
    
    - `student_academic_details`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references student_profiles)
      - Academic info: school_name, grade, subjects, percentage
    
    - `student_extracurricular`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references student_profiles)
      - Activity name, description, duration
    
    - `student_achievements`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references student_profiles)
      - Achievement title, certificate, date
    
    - `student_progress`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references student_profiles)
      - registration_complete, identification_complete, onboarding_complete, training_complete, placement_complete
  
  2. Security
    - Enable RLS on all tables
    - Students can only access their own data
*/

CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own profile"
  ON student_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update own profile"
  ON student_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS student_registration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  phone text,
  date_of_birth text,
  gender text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_student_id FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

ALTER TABLE student_registration ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own registration"
  ON student_registration FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_registration.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert own registration"
  ON student_registration FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_registration.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own registration"
  ON student_registration FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_registration.student_id
      AND student_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_registration.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS student_academic_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  school_name text,
  grade text,
  subjects text,
  percentage text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_academic_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own academic details"
  ON student_academic_details FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_academic_details.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can manage own academic details"
  ON student_academic_details FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_academic_details.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own academic details"
  ON student_academic_details FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_academic_details.student_id
      AND student_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_academic_details.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS student_extracurricular (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  activity_name text,
  description text,
  duration text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_extracurricular ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own extracurricular"
  ON student_extracurricular FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_extracurricular.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can manage own extracurricular"
  ON student_extracurricular FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_extracurricular.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own extracurricular"
  ON student_extracurricular FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_extracurricular.student_id
      AND student_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_extracurricular.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS student_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  title text,
  certificate_path text,
  date text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own achievements"
  ON student_achievements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_achievements.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can manage own achievements"
  ON student_achievements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_achievements.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own achievements"
  ON student_achievements FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_achievements.student_id
      AND student_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_achievements.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL UNIQUE REFERENCES student_profiles(id) ON DELETE CASCADE,
  registration_complete boolean DEFAULT false,
  identification_complete boolean DEFAULT false,
  onboarding_complete boolean DEFAULT false,
  training_complete boolean DEFAULT false,
  placement_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own progress"
  ON student_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_progress.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own progress"
  ON student_progress FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_progress.student_id
      AND student_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_progress.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );
