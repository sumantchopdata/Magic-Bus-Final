import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import IdentityDocumentUpload from './IdentityDocumentUpload';

interface PersonalDetailsFormProps {
  studentId: string;
  onUpdate: () => void;
}

export default function PersonalDetailsForm({ studentId, onUpdate }: PersonalDetailsFormProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    age: '',
    location_type: '',
    family_structure: '',
    bpl_status: false,
    disability: false,
    disability_description: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPersonalDetails();
  }, [studentId]);

  const loadPersonalDetails = async () => {
    if (!studentId) return;
    const { data } = await supabase
      .from('student_registration')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (data) {
      setFormData(data);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data: existing } = await supabase
        .from('student_registration')
        .select('id')
        .eq('student_id', studentId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('student_registration')
          .update(formData)
          .eq('student_id', studentId);
      } else {
        await supabase.from('student_registration').insert({
          student_id: studentId,
          ...formData,
        });
      }

      setMessage('Personal details saved successfully!');
      onUpdate();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving details. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b-2 border-gray-300 pb-6">
        <h3 className="text-3xl font-semibold text-gray-800 mb-8">Section 1: Basic Information</h3>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="100"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location Type</label>
            <select
              name="location_type"
              value={formData.location_type}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Select Location Type</option>
              <option value="urban">Urban</option>
              <option value="rural">Rural</option>
              <option value="tribal">Tribal</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-3xl font-semibold text-gray-800 mb-8">Section 2: Family Background</h3>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Family Structure</label>
            <select
              name="family_structure"
              value={formData.family_structure}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Select Family Structure</option>
              <option value="both_parents">Both Parents</option>
              <option value="single_parent">Single Parent</option>
              <option value="orphan">Orphan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Below Poverty Line (BPL) Status</label>
            <select
              name="bpl_status"
              value={formData.bpl_status === true ? 'yes' : 'no'}
              onChange={(e) => setFormData(prev => ({ ...prev, bpl_status: e.target.value === 'yes' }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              name="disability"
              checked={formData.disability}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Does the student have a disability?
          </label>
        </div>

        {formData.disability && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Disability Description (Optional)</label>
            <textarea
              name="disability_description"
              value={formData.disability_description}
              onChange={handleChange}
              placeholder="Describe the type of disability..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        )}
      </div>

      <IdentityDocumentUpload studentId={studentId} />

      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
      >
        {loading ? 'Saving...' : 'Save Personal Details'}
      </button>
    </form>
  );
}
