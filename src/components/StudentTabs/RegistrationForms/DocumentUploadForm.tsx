import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Upload, X, File } from 'lucide-react';

interface DocumentUploadFormProps {
  studentId: string;
  onUpdate: () => void;
}

interface Document {
  id: string;
  document_type: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
}

const DOCUMENT_TYPES = [
  { label: '10th Certificate', value: 'class_10_certificate' },
  { label: '12th Certificate', value: 'class_12_certificate' },
  { label: 'Aadhar Card', value: 'aadhar_card' },
  { label: 'Diploma Certificate', value: 'diploma_certificate' },
  { label: 'Degree Certificate', value: 'degree_certificate' },
  { label: 'Mark Sheet', value: 'mark_sheet' },
  { label: 'ID Proof', value: 'id_proof' },
  { label: 'Address Proof', value: 'address_proof' },
  { label: 'Other', value: 'other' },
];

export default function DocumentUploadForm({ studentId, onUpdate }: DocumentUploadFormProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [studentId]);

  const loadDocuments = async () => {
    if (!studentId) return;
    const { data } = await supabase
      .from('student_documents')
      .select('id, document_type, file_name, file_size, uploaded_at')
      .eq('student_id', studentId)
      .order('uploaded_at', { ascending: false });

    if (data) {
      setDocuments(data);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedType || !studentId) {
      setMessage('Please select a document type and file');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${studentId}/${selectedType}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(fileName, selectedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('student_documents')
        .insert({
          student_id: studentId,
          document_type: selectedType,
          file_path: fileName,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
        });

      if (dbError) throw dbError;

      setMessage('Document uploaded successfully!');
      setSelectedFile(null);
      setSelectedType('');
      (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
      await loadDocuments();
      onUpdate();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading document. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    setLoading(true);
    try {
      await supabase
        .from('student_documents')
        .delete()
        .eq('id', docId);

      await loadDocuments();
      setMessage('Document deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting document. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Certificates & Documents</h3>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Select Document Type</option>
              {DOCUMENT_TYPES.map((doc) => (
                <option key={doc.value} value={doc.value}>
                  {doc.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Choose File</label>
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
              <div className="flex flex-col items-center">
                <Upload className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-sm text-gray-700">
                  {selectedFile ? selectedFile.name : 'Click to select or drag and drop'}
                </span>
                <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</span>
              </div>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
              />
            </label>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedFile || !selectedType}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      {documents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Documents</h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">{doc.file_name}</p>
                    <p className="text-xs text-gray-500">
                      {DOCUMENT_TYPES.find((d) => d.value === doc.document_type)?.label} - {formatFileSize(doc.file_size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={loading}
                  className="text-red-500 hover:text-red-700 disabled:text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
