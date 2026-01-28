import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Trash2, Plus } from 'lucide-react';

interface AchievementsFormProps {
  studentId: string;
}

interface Achievement {
  id?: string;
  title: string;
  certificate_path: string;
  date: string;
}

export default function AchievementsForm({ studentId }: AchievementsFormProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    title: '',
    certificate_path: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAchievements();
  }, [studentId]);

  const loadAchievements = async () => {
    if (!studentId) return;
    const { data } = await supabase
      .from('student_achievements')
      .select('*')
      .eq('student_id', studentId);

    if (data) {
      setAchievements(data);
    }
  };

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchievement.title) {
      setMessage('Please enter an achievement title');
      return;
    }

    setLoading(true);
    try {
      await supabase.from('student_achievements').insert({
        student_id: studentId,
        ...newAchievement,
      });

      setNewAchievement({ title: '', certificate_path: '', date: '' });
      setMessage('Achievement added successfully!');
      loadAchievements();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding achievement. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    try {
      await supabase.from('student_achievements').delete().eq('id', id);
      loadAchievements();
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-4xl font-bold text-gray-900 mb-8">Your Achievements</h3>

        {achievements.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">🏆 {achievement.title}</h4>
                    {achievement.certificate_path && (
                      <p className="text-gray-600 text-xs mt-2">
                        Certificate: <span className="text-blue-600">{achievement.certificate_path}</span>
                      </p>
                    )}
                    {achievement.date && <p className="text-gray-500 text-xs mt-2">Date: {achievement.date}</p>}
                  </div>
                  <button
                    onClick={() => achievement.id && handleDeleteAchievement(achievement.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleAddAchievement} className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add New Achievement
        </h4>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Achievement Title</label>
          <input
            type="text"
            value={newAchievement.title}
            onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
            placeholder="e.g., National Science Olympiad Winner"
            required
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Certificate/Award</label>
          <input
            type="text"
            value={newAchievement.certificate_path}
            onChange={(e) => setNewAchievement({ ...newAchievement, certificate_path: e.target.value })}
            placeholder="e.g., Certificate No. 12345 or Award Name"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Date Awarded</label>
          <input
            type="date"
            value={newAchievement.date}
            onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
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
          {loading ? 'Adding...' : 'Add Achievement'}
        </button>
      </form>
    </div>
  );
}
