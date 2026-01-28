import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import PersonalDetailsForm from '../StudentTabs/RegistrationForms/PersonalDetailsForm';
import AcademicDetailsForm from '../StudentTabs/RegistrationForms/AcademicDetailsForm';
import ExtracurricularForm from '../StudentTabs/RegistrationForms/ExtracurricularForm';
import AchievementsForm from '../StudentTabs/RegistrationForms/AchievementsForm';
import { supabase } from '../../lib/supabase';

type RegistrationTab = 'personal' | 'academic' | 'extracurricular' | 'achievements' | 'review';

interface RegistrationSectionProps {
  onProgressUpdate: () => void;
}

export default function RegistrationSection({ onProgressUpdate }: RegistrationSectionProps) {
  const [activeTab, setActiveTab] = useState<RegistrationTab>('personal');
  const [studentId, setStudentId] = useState<string>('');

  useEffect(() => {
    getStudentId();
  }, []);

  const getStudentId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setStudentId(profile.id);
      }
    } catch (error) {
      console.error('Error getting student ID:', error);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: '👤' },
    { id: 'academic', label: 'Academic Details', icon: '📚' },
    { id: 'extracurricular', label: 'Extra-Curricular', icon: '⚽' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'review', label: 'Review & Confirm', icon: '✓' },
  ];

  return (
    <div>
      <div className="sticky top-0 bg-white z-10 pb-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Complete Your Registration</h2>
      </div>

      <div className="mb-12 border-b border-gray-200 -mx-16 px-16">
        <div className="flex gap-12 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as RegistrationTab)}
              className={`px-2 py-6 text-sm font-semibold whitespace-nowrap border-b-3 transition-colors flex items-center gap-3 ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'personal' && studentId && (
        <PersonalDetailsForm studentId={studentId} onProgressUpdate={onProgressUpdate} />
      )}
      {activeTab === 'academic' && studentId && (
        <AcademicDetailsForm studentId={studentId} onProgressUpdate={onProgressUpdate} />
      )}
      {activeTab === 'extracurricular' && studentId && (
        <ExtracurricularForm studentId={studentId} onProgressUpdate={onProgressUpdate} />
      )}
      {activeTab === 'achievements' && studentId && (
        <AchievementsForm studentId={studentId} onProgressUpdate={onProgressUpdate} />
      )}
      {activeTab === 'review' && studentId && (
        <div className="space-y-8">
          <div className="bg-blue-50 border-l-6 border-blue-500 p-6 rounded">
            <h3 className="font-bold text-blue-900 mb-3 text-lg">Review Your Information</h3>
            <p className="text-blue-800 text-sm">
              Please review all your submitted information below. Make sure everything is correct before confirming.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-8 text-3xl">Personal Details</h4>
              <p className="text-sm text-gray-600">Your personal information has been submitted for review.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-8 text-3xl">Academic Details</h4>
              <p className="text-sm text-gray-600">Your educational background is ready for verification.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-8 text-3xl">Extra-Curricular Activities</h4>
              <p className="text-sm text-gray-600">Your activities and interests have been recorded.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-8 text-3xl">Achievements</h4>
              <p className="text-sm text-gray-600">Your achievements are displayed on your profile.</p>
            </div>
          </div>

          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">
            Confirm & Submit Registration
          </button>
        </div>
      )}
    </div>
  );
}
