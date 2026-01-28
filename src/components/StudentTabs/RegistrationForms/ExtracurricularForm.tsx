import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Trash2, Plus } from 'lucide-react';

interface ExtracurricularFormProps {
  studentId: string;
}

interface Activity {
  id?: string;
  activity_name: string;
  description: string;
  duration: string;
}

export default function ExtracurricularForm({ studentId }: ExtracurricularFormProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState<Activity>({
    activity_name: '',
    description: '',
    duration: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadActivities();
  }, [studentId]);

  const loadActivities = async () => {
    if (!studentId) return;
    const { data } = await supabase
      .from('student_extracurricular')
      .select('*')
      .eq('student_id', studentId);

    if (data) {
      setActivities(data);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.activity_name || !newActivity.description) {
      setMessage('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await supabase.from('student_extracurricular').insert({
        student_id: studentId,
        ...newActivity,
      });

      setNewActivity({ activity_name: '', description: '', duration: '' });
      setMessage('Activity added successfully!');
      loadActivities();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding activity. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await supabase.from('student_extracurricular').delete().eq('id', id);
      loadActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-4xl font-bold text-gray-900 mb-8">Your Extracurricular Activities</h3>

        {activities.length > 0 && (
          <div className="space-y-3 mb-6">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-blue-50 p-4 rounded-lg flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{activity.activity_name}</h4>
                  <p className="text-gray-600 text-xs mt-1">{activity.description}</p>
                  {activity.duration && <p className="text-gray-500 text-xs mt-2">Duration: {activity.duration}</p>}
                </div>
                <button
                  onClick={() => activity.id && handleDeleteActivity(activity.id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleAddActivity} className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add New Activity
        </h4>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Activity Name</label>
          <input
            type="text"
            value={newActivity.activity_name}
            onChange={(e) => setNewActivity({ ...newActivity, activity_name: e.target.value })}
            placeholder="e.g., School Debate Team"
            required
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            value={newActivity.description}
            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
            placeholder="Describe your involvement and achievements"
            rows={3}
            required
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Duration</label>
          <input
            type="text"
            value={newActivity.duration}
            onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
            placeholder="e.g., 2 years, Jan 2022 - Present"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-xs ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors text-xs"
        >
          {loading ? 'Adding...' : 'Add Activity'}
        </button>
      </form>
    </div>
  );
}
