interface TrainingTabProps {
  studentId: string;
  onProgressUpdate: () => void;
}

export default function TrainingTab({ studentId, onProgressUpdate }: TrainingTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Training</h2>
      <div className="bg-purple-50 p-8 rounded-lg text-center">
        <div className="text-5xl mb-4">📚</div>
        <p className="text-gray-600 text-lg">
          Complete your Onboarding first to access this section.
        </p>
        <p className="text-gray-500 mt-2">
          Participate in skill development and training programs.
        </p>
      </div>
    </div>
  );
}
