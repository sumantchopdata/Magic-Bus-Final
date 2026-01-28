/*
  # Create Education History Table
  
  1. New Tables
    - `student_education_history`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to auth.users)
      - `education_level` (text: 'class_10', 'class_12', 'diploma', 'graduate', 'post_graduate')
      - `school_college_name` (text)
      - `degree_certificate` (text)
      - `year_of_graduation` (integer)
      - `marks_percentage` (numeric)
      - `school_college_address` (text)
      - `school_type` (text: 'government', 'private')
      - `subjects` (text)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `student_education_history` table
    - Add policy for authenticated users to view/manage their own education records
*/

CREATE TABLE IF NOT EXISTS student_education_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  education_level text NOT NULL CHECK (education_level IN ('class_10', 'class_12', 'diploma', 'graduate', 'post_graduate')),
  school_college_name text NOT NULL,
  degree_certificate text NOT NULL,
  year_of_graduation integer NOT NULL,
  marks_percentage numeric(5,2),
  school_college_address text,
  school_type text CHECK (school_type IN ('government', 'private')),
  subjects text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE student_education_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own education history"
  ON student_education_history FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Users can insert their own education records"
  ON student_education_history FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can update their own education records"
  ON student_education_history FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can delete their own education records"
  ON student_education_history FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());