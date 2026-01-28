/*
  # Create screening tests table

  1. New Tables
    - `screening_tests`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to student_profiles)
      - `answers` (jsonb, stores answers to all 10 questions)
      - `completed` (boolean, true when all questions answered)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `screening_tests` table
    - Add policy for students to read their own test data
    - Add policy for students to update their own test data
*/

CREATE TABLE IF NOT EXISTS screening_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  answers jsonb DEFAULT '{}',
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE screening_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own screening test"
  ON screening_tests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = screening_tests.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own screening test"
  ON screening_tests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = screening_tests.student_id
      AND student_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = screening_tests.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert own screening test"
  ON screening_tests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = screening_tests.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );
