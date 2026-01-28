import { useState, useEffect } from 'react';
import { User, BookOpen, ClipboardCheck, Star, FileCheck, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import PersonalDetailsForm from './RegistrationForms/PersonalDetailsForm';
import AcademicDetailsForm from './RegistrationForms/AcademicDetailsForm';
import ExtracurricularForm from './RegistrationForms/ExtracurricularForm';
import ScreeningTestForm from './RegistrationForms/ScreeningTestForm';
import DocumentUploadForm from './RegistrationForms/DocumentUploadForm';

interface RegistrationTabProps {
  studentId: string;
  onProgressUpdate: () => void;
}

export default function RegistrationTab({ studentId, onProgressUpdate }: RegistrationTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'academic' | 'extracurricular' | 'screening' | 'documents'>('personal');
  const [personalComplete, setPersonalComplete] = useState(false);
  const [academicComplete, setAcademicComplete] = useState(false);

  useEffect(() => {
    checkPersonalDetailsCompletion();
  }, [studentId]);

  const checkPersonalDetailsCompletion = async () => {
    if (!studentId) return;
    const { data } = await supabase
      .from('student_registration')
      .select('first_name, last_name, email, phone')
      .eq('student_id', studentId)
      .maybeSingle();

    if (data?.first_name && data?.last_name && data?.email && data?.phone) {
      setPersonalComplete(true);
    }

    const { data: academic } = await supabase
      .from('student_academic_details')
      .select('school_name, grade')
      .eq('student_id', studentId)
      .maybeSingle();

    if (academic?.school_name && academic?.grade) {
      setAcademicComplete(true);
    }
  };

  const subTabs = [
    { id: 'personal', label: 'Personal Details', complete: personalComplete, icon: <User className="w-8 h-8" /> },
    { id: 'academic', label: 'Academic Details', complete: academicComplete, icon: <BookOpen className="w-8 h-8" /> },
    { id: 'extracurricular', label: 'Extracurricular', complete: false, icon: <Star className="w-8 h-8" /> },
    { id: 'screening', label: 'Screening Test', complete: false, icon: <ClipboardCheck className="w-8 h-8" /> },
    { id: 'documents', label: 'Documents', complete: false, icon: <FileCheck className="w-8 h-8" /> },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Student Registration</h2>

      <div className="flex flex-wrap gap-4 mb-10 pb-8 border-b">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex flex-col items-center justify-center w-32 h-32 rounded-2xl font-semibold text-sm transition-all ${
              activeSubTab === tab.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${tab.complete ? 'ring-4 ring-green-400' : ''}`}
          >
            <span className="mb-2 flex items-center justify-center">
              {tab.icon}
            </span>
            <span className="text-center px-2">{tab.label}</span>
            {tab.complete && <Check className="w-6 h-6 text-green-300 absolute top-2 right-2" />}
          </button>
        ))}
      </div>

      <div>
        {activeSubTab === 'personal' && (
          <PersonalDetailsForm
            studentId={studentId}
            onUpdate={() => {
              checkPersonalDetailsCompletion();
              onProgressUpdate();
            }}
          />
        )}
        {activeSubTab === 'academic' && (
          <AcademicDetailsForm
            studentId={studentId}
            onUpdate={() => {
              checkPersonalDetailsCompletion();
              onProgressUpdate();
            }}
          />
        )}
        {activeSubTab === 'extracurricular' && <ExtracurricularForm studentId={studentId} />}
        {activeSubTab === 'screening' && <ScreeningTestForm studentId={studentId} />}
        {activeSubTab === 'documents' && (
          <DocumentUploadForm
            studentId={studentId}
            onUpdate={() => {
              checkPersonalDetailsCompletion();
              onProgressUpdate();
            }}
          />
        )}
      </div>
    </div>
  );
}
