import { useState, useEffect } from 'react';
import { Upload, X, FileText, Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface IdentityDocumentUploadProps {
  studentId: string;
}

export default function IdentityDocumentUpload({ studentId }: IdentityDocumentUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

  useEffect(() => {
    loadUploadedDocuments();
  }, [studentId]);

  const loadUploadedDocuments = async () => {
    if (!studentId) return;
    const { data } = await supabase
      .from('identity_documents')
      .select('*')
      .eq('student_id', studentId);

    if (data) {
      setUploadedDocuments(data);
    }
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.type !== 'application/pdf') {
      return { valid: false, error: 'Invalid file type. Please upload a PDF file.' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'File size exceeds the limit. Please upload a file smaller than 5MB.' };
    }
    return { valid: true };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    setMessage('');
    const validation = validateFile(file);

    if (!validation.valid) {
      setMessage(validation.error || 'Invalid file');
      return;
    }

    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  const handleUpload = async () => {
    if (!uploadedFile || !studentId) return;

    setLoading(true);
    setMessage('');

    try {
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (!file) {
        setMessage('Please select a file first');
        setLoading(false);
        return;
      }

      const fileName = `${studentId}-${Date.now()}-${uploadedFile.name}`;
      const filePath = `identity-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('identity-documents')
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        setMessage('Error uploading file. Please try again.');
        console.error(uploadError);
        setLoading(false);
        return;
      }

      const documentType = uploadedFile.name.toLowerCase().includes('aadhar') ? 'aadhar' : 'pan';

      const { error: dbError } = await supabase
        .from('identity_documents')
        .insert({
          student_id: studentId,
          document_type: documentType,
          file_path: filePath,
          file_name: uploadedFile.name,
          file_size: uploadedFile.size,
        });

      if (dbError) {
        setMessage('Error saving document. Please try again.');
        console.error(dbError);
        setLoading(false);
        return;
      }

      setMessage('Your Aadhar/PAN card has been uploaded successfully!');
      setUploadedFile(null);
      if (fileInput) fileInput.value = '';
      await loadUploadedDocuments();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading file. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDocument = async (docId: string, filePath: string) => {
    try {
      await supabase.storage
        .from('identity-documents')
        .remove([filePath]);

      await supabase
        .from('identity_documents')
        .delete()
        .eq('id', docId);

      setMessage('Document removed successfully');
      await loadUploadedDocuments();
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Error removing document. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg border-2 border-gray-200 mt-8">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Upload Aadhar Card or PAN Card</h3>
        <p className="text-gray-600 text-sm">Please upload a valid Aadhar Card or PAN Card (PDF format only)</p>
      </div>

      {uploadedDocuments.length > 0 && (
        <div className="mb-6 bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-700">Documents Uploaded</span>
          </div>
          {uploadedDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between bg-white p-3 rounded mb-2 border border-green-200">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800">{doc.file_name}</p>
                  <p className="text-xs text-gray-500">{(doc.file_size / 1024).toFixed(2)} KB • {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveDocument(doc.id, doc.file_path)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-4 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <Upload className="w-12 h-12 text-blue-500 mb-3" />
          <p className="text-lg font-semibold text-gray-700 mb-2">
            Drag & drop your Aadhar/PAN card PDF here
          </p>
          <p className="text-sm text-gray-600 mb-4">or</p>
          <label className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg cursor-pointer transition-colors">
            Browse Files
            <input
              id="file-input"
              type="file"
              accept="application/pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-4">Only PDF files up to 5MB allowed</p>
        </div>
      </div>

      {uploadedFile && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button
              onClick={() => {
                setUploadedFile(null);
                const fileInput = document.getElementById('file-input') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
              }}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {uploadedFile && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      )}

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg text-sm font-medium ${
            message.includes('successfully') || message.includes('removed')
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
