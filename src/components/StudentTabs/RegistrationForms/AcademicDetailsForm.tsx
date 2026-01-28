import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface EducationRecord {
  id?: string;
  education_level: string;
  school_college_name: string;
  degree_certificate: string;
  year_of_graduation: string;
  marks_percentage: string;
  school_college_address: string;
  school_type: string;
  subjects: string;
}

interface AcademicDetailsFormProps {
  studentId: string;
  onUpdate: () => void;
}

export default function AcademicDetailsForm({ studentId, onUpdate }: AcademicDetailsFormProps) {
  const [educationRecords, setEducationRecords] = useState<EducationRecord[]>([
    {
      education_level: '',
      school_college_name: '',
      degree_certificate: '',
      year_of_graduation: '',
      marks_percentage: '',
      school_college_address: '',
      school_type: '',
      subjects: '',
    },
  ]);
  const [showAddMore, setShowAddMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    loadEducationHistory();
  }, [studentId]);

  const loadEducationHistory = async () => {
    if (!studentId) return;
    const { data } = await supabase
      .from('student_education_history')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: true });

    if (data && data.length > 0) {
      const records = data.map((record) => ({
        id: record.id,
        education_level: record.education_level,
        school_college_name: record.school_college_name,
        degree_certificate: record.degree_certificate,
        year_of_graduation: record.year_of_graduation.toString(),
        marks_percentage: record.marks_percentage?.toString() || '',
        school_college_address: record.school_college_address || '',
        school_type: record.school_type || '',
        subjects: record.subjects || '',
      }));
      setEducationRecords(records);
      setShowAddMore(false);
    }
  };

  const handleRecordChange = (
    index: number,
    field: keyof EducationRecord,
    value: string
  ) => {
    const updated = [...educationRecords];
    updated[index] = { ...updated[index], [field]: value };
    setEducationRecords(updated);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    educationRecords.forEach((record, index) => {
      if (!record.education_level) {
        errors.push(`Section ${index + 1}: Education level is required`);
      }
      if (!record.school_college_name.trim()) {
        errors.push(`Section ${index + 1}: School/College name is required`);
      }
      if (!record.degree_certificate.trim()) {
        errors.push(`Section ${index + 1}: Degree/Certificate is required`);
      }
      if (!record.year_of_graduation) {
        errors.push(`Section ${index + 1}: Year of graduation is required`);
      }
      const year = parseInt(record.year_of_graduation);
      if (isNaN(year) || year < 1990 || year > new Date().getFullYear()) {
        errors.push(`Section ${index + 1}: Valid year of graduation is required`);
      }
      if (record.marks_percentage && (isNaN(parseFloat(record.marks_percentage)) || parseFloat(record.marks_percentage) > 100)) {
        errors.push(`Section ${index + 1}: Marks/Percentage must be a number between 0-100`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAddEducation = () => {
    setEducationRecords([
      ...educationRecords,
      {
        education_level: '',
        school_college_name: '',
        degree_certificate: '',
        year_of_graduation: '',
        marks_percentage: '',
        school_college_address: '',
        school_type: '',
        subjects: '',
      },
    ]);
    setShowAddMore(false);
  };

  const handleRemoveEducation = (index: number) => {
    setEducationRecords(educationRecords.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await supabase
        .from('student_education_history')
        .delete()
        .eq('student_id', studentId);

      const recordsToInsert = educationRecords.map((record) => ({
        student_id: studentId,
        education_level: record.education_level,
        school_college_name: record.school_college_name,
        degree_certificate: record.degree_certificate,
        year_of_graduation: parseInt(record.year_of_graduation),
        marks_percentage: record.marks_percentage ? parseFloat(record.marks_percentage) : null,
        school_college_address: record.school_college_address || null,
        school_type: record.school_type || null,
        subjects: record.subjects || null,
      }));

      const { error } = await supabase
        .from('student_education_history')
        .insert(recordsToInsert);

      if (error) throw error;

      setMessage('Academic details saved successfully!');
      onUpdate();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving details. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getEducationLevelLabel = (level: string): string => {
    const labels: { [key: string]: string } = {
      class_10: '10th Grade',
      class_12: '12th Grade',
      diploma: 'Diploma',
      graduate: 'Graduation',
      post_graduate: 'Post-Graduation',
    };
    return labels[level] || 'Education';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-3xl font-semibold text-gray-800 mb-2">Academic Information</h3>
        <p className="text-gray-600 text-sm mb-6">Add your educational background details</p>
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <p className="text-red-700 font-semibold mb-2">Please fix the following errors:</p>
          <ul className="space-y-1">
            {validationErrors.map((error, idx) => (
              <li key={idx} className="text-red-600 text-sm flex items-start">
                <span className="mr-2">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-8">
        {educationRecords.map((record, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  Education Level {index + 1}
                </h4>
                {record.education_level && (
                  <p className="text-sm text-gray-600 mt-1">
                    {getEducationLevelLabel(record.education_level)}
                  </p>
                )}
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Education Level
                </label>
                <select
                  value={record.education_level}
                  onChange={(e) =>
                    handleRecordChange(index, 'education_level', e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm bg-white"
                >
                  <option value="">Select Education Level</option>
                  <option value="class_10">Class 10</option>
                  <option value="class_12">Class 12</option>
                  <option value="diploma">Diploma</option>
                  <option value="graduate">Graduate</option>
                  <option value="post_graduate">Post-Graduate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  School/College Type
                </label>
                <select
                  value={record.school_type}
                  onChange={(e) =>
                    handleRecordChange(index, 'school_type', e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm bg-white"
                >
                  <option value="">Select School Type</option>
                  <option value="government">Government</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  School/College Name
                </label>
                <input
                  type="text"
                  value={record.school_college_name}
                  onChange={(e) =>
                    handleRecordChange(
                      index,
                      'school_college_name',
                      e.target.value
                    )
                  }
                  placeholder="e.g., St. Paul School"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Degree/Certificate
                </label>
                <input
                  type="text"
                  value={record.degree_certificate}
                  onChange={(e) =>
                    handleRecordChange(index, 'degree_certificate', e.target.value)
                  }
                  placeholder="e.g., B.Tech, Science, Commerce"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year of Graduation
                </label>
                <input
                  type="number"
                  value={record.year_of_graduation}
                  onChange={(e) =>
                    handleRecordChange(index, 'year_of_graduation', e.target.value)
                  }
                  placeholder="e.g., 2020"
                  min="1990"
                  max={new Date().getFullYear().toString()}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Marks / Percentage
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={record.marks_percentage}
                    onChange={(e) =>
                      handleRecordChange(index, 'marks_percentage', e.target.value)
                    }
                    placeholder="0-100"
                    min="0"
                    max="100"
                    step="0.01"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <span className="flex items-center text-gray-700 font-semibold">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                School/College Address
              </label>
              <textarea
                value={record.school_college_address}
                onChange={(e) =>
                  handleRecordChange(index, 'school_college_address', e.target.value)
                }
                placeholder="Enter the complete address of your school/college"
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subjects
              </label>
              <textarea
                value={record.subjects}
                onChange={(e) =>
                  handleRecordChange(index, 'subjects', e.target.value)
                }
                placeholder="e.g., Mathematics, English, Science"
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {!showAddMore ? (
        <button
          type="button"
          onClick={() => setShowAddMore(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-blue-400 hover:bg-blue-50 text-blue-600 font-semibold py-3 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Another Education Section
        </button>
      ) : (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 space-y-4">
          <p className="text-gray-700 font-semibold">Add additional education?</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleAddEducation}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Yes, Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddMore(false)}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            message.includes('successfully')
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
      >
        {loading ? 'Saving...' : 'Save Academic Details'}
      </button>
    </form>
  );
}
