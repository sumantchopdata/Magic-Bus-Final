/*
  # Expand Registration Form Fields

  1. Enhanced student_registration table with:
     - Gender (radio buttons): male, female, other
     - Age (numeric)
     - Location Type: urban, rural, tribal
     - Family Structure: both_parents, single_parent, orphan
     - Below Poverty Line (BPL) Status: boolean
     - Disability Status: boolean
     - Disability Description: text (optional)
  
  2. Enhanced student_academic_details table with:
     - School Type: government, private
     - Highest Education Completed: class_10, class_12, diploma, graduate, post_graduate
     - Years Since Last Education: numeric
     - Marks/Percentage: numeric

  3. New student_documents table for:
     - Certificate uploads (10th, 12th, Aadhar, etc.)
     - Document type and file path tracking

  4. Security
     - Enable RLS on student_documents table
     - Students can only access their own documents
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_registration' AND column_name = 'age'
  ) THEN
    ALTER TABLE student_registration
      ADD COLUMN age integer,
      ADD COLUMN location_type text,
      ADD COLUMN family_structure text,
      ADD COLUMN bpl_status boolean DEFAULT false,
      ADD COLUMN disability boolean DEFAULT false,
      ADD COLUMN disability_description text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_academic_details' AND column_name = 'school_type'
  ) THEN
    ALTER TABLE student_academic_details
      ADD COLUMN school_type text,
      ADD COLUMN highest_education text,
      ADD COLUMN years_since_education integer,
      ADD COLUMN marks_percentage numeric(5,2);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS student_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own documents"
  ON student_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_documents.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can upload documents"
  ON student_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_documents.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own documents"
  ON student_documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_documents.student_id
      AND student_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_documents.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can delete own documents"
  ON student_documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_profiles
      WHERE student_profiles.id = student_documents.student_id
      AND student_profiles.user_id = auth.uid()
    )
  );
