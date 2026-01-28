/*
  # Create Identity Documents Table
  
  1. New Tables
    - `identity_documents`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to auth.users)
      - `document_type` (text: 'aadhar' or 'pan')
      - `file_path` (text, stored in Supabase storage)
      - `file_name` (text)
      - `file_size` (integer)
      - `uploaded_at` (timestamp)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `identity_documents` table
    - Add policy for authenticated users to upload/view their own documents
*/

CREATE TABLE IF NOT EXISTS identity_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  document_type text NOT NULL CHECK (document_type IN ('aadhar', 'pan')),
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE identity_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own identity documents"
  ON identity_documents FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Users can upload their own identity documents"
  ON identity_documents FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can delete their own identity documents"
  ON identity_documents FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());