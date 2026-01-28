import { useState, useEffect } from 'react';
import { BookOpen, FileCheck, User, Briefcase, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from './DesktopLayout/Header';
import SidebarNav from './DesktopLayout/SidebarNav';
import RegistrationSection from './StudentSections/RegistrationSection';
import ApplicationStatusSection from './StudentSections/ApplicationStatusSection';
import OnboardingSection from './StudentSections/OnboardingSection';
import TrainingModulesSection from './StudentSections/TrainingModulesSection';
import PlacementSection from './StudentSections/PlacementSection';
import StudentChatbot from './StudentChatbot';

type SectionType = 'registration' | 'application-status' | 'onboarding' | 'training' | 'placement';

interface StudentInfo {
  first_name: string;
  email: string;
}

interface ProgressStatus {
  registration_complete: boolean;
  identification_complete: boolean;
  onboarding_complete: boolean;
  training_complete: boolean;
  placement_complete: boolean;
}

export default function StudentLandingPage({ onLogout }: { onLogout: () => void }) {
  const [activeSection, setActiveSection] = useState<SectionType>('registration');
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({ first_name: 'Student', email: '' });
  const [progress, setProgress] = useState<ProgressStatus>({
    registration_complete: false,
    identification_complete: false,
    onboarding_complete: false,
    training_complete: false,
    placement_complete: false,
  });
  const [loading, setLoading] = useState(true);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        const { data: registration } = await supabase
          .from('student_registration')
          .select('first_name')
          .eq('student_id', profile.id)
          .maybeSingle();

        if (registration?.first_name) {
          setStudentInfo(prev => ({ ...prev, first_name: registration.first_name }));
        }

        setStudentInfo(prev => ({ ...prev, email: user.email || '' }));

        const { data: progressData } = await supabase
          .from('student_progress')
          .select('*')
          .eq('student_id', profile.id)
          .maybeSingle();

        if (progressData) {
          setProgress(progressData);
        }
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    {
      id: 'registration',
      label: 'Registration',
      icon: <FileCheck className="w-16 h-16" />,
      completed: progress.registration_complete,
      disabled: false,
    },
    {
      id: 'application-status',
      label: 'Application Status',
      icon: <CheckCircle className="w-16 h-16" />,
      completed: false,
      disabled: false,
    },
    {
      id: 'onboarding',
      label: 'Student Onboarding',
      icon: <User className="w-16 h-16" />,
      completed: progress.onboarding_complete,
      disabled: !progress.registration_complete,
    },
    {
      id: 'training',
      label: 'Training Modules',
      icon: <BookOpen className="w-16 h-16" />,
      completed: progress.training_complete,
      disabled: !progress.onboarding_complete,
    },
    {
      id: 'placement',
      label: 'Placement Support',
      icon: <Briefcase className="w-16 h-16" />,
      completed: progress.placement_complete,
      disabled: !progress.training_complete,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-red-600 mx-auto mb-8"></div>
          <p className="text-2xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header
        studentName={studentInfo.first_name}
        studentEmail={studentInfo.email}
        onLogout={onLogout}
        onGoBack={onLogout}
      />

      <SidebarNav
        activeSection={activeSection}
        onSectionChange={(id) => setActiveSection(id as SectionType)}
        items={navItems}
      />

      <main className="fixed top-40 left-96 right-0 bottom-0 overflow-y-auto">
        <div className="p-8 relative">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-6xl">
            {activeSection === 'registration' && (
              <RegistrationSection onProgressUpdate={loadStudentData} />
            )}
            {activeSection === 'application-status' && (
              <ApplicationStatusSection progress={progress} />
            )}
            {activeSection === 'onboarding' && (
              <OnboardingSection onProgressUpdate={loadStudentData} />
            )}
            {activeSection === 'training' && (
              <TrainingModulesSection onProgressUpdate={loadStudentData} />
            )}
            {activeSection === 'placement' && (
              <PlacementSection onProgressUpdate={loadStudentData} />
            )}
          </div>
        </div>
      </main>

      <StudentChatbot isOpen={chatbotOpen} onToggle={() => setChatbotOpen(!chatbotOpen)} />
    </div>
  );
}
