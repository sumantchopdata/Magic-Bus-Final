interface OnboardingTabProps {
  studentId: string;
  onProgressUpdate: () => void;
}

export default function OnboardingTab({ studentId, onProgressUpdate }: OnboardingTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Onboarding</h2>
      <div className="bg-green-50 p-8 rounded-lg text-center">
        <div className="text-5xl mb-4">👋</div>
        <p className="text-gray-600 text-lg">
          Complete your Identification first to access this section.
        </p>
        <p className="text-gray-500 mt-2">
          Get onboarded with our program and meet your mentors.
        </p>
      </div>
    </div>
  );
}
