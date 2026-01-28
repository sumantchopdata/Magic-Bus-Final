import { CheckCircle, Users, BookOpen } from 'lucide-react';

interface OnboardingSectionProps {
  onProgressUpdate: () => void;
}

export default function OnboardingSection({ onProgressUpdate }: OnboardingSectionProps) {
  const onboardingSteps = [
    {
      title: 'Welcome Orientation',
      description: 'Get introduced to the Magic Bus program, meet your mentors and peers',
      status: 'completed',
    },
    {
      title: 'Understand Your Goals',
      description: 'Define your personal and professional goals with your counselor',
      status: 'completed',
    },
    {
      title: 'Explore Resources',
      description: 'Access learning materials, tools, and support systems available to you',
      status: 'in-progress',
    },
    {
      title: 'Connect with Mentors',
      description: 'Build relationships with your assigned mentors and peer groups',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Onboarding</h2>
        <p className="text-gray-600">Get started on your Magic Bus journey with our comprehensive onboarding program</p>
      </div>

      <div className="space-y-4">
        {onboardingSteps.map((step, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border-l-4 transition-all ${
              step.status === 'completed'
                ? 'bg-green-50 border-green-500'
                : step.status === 'in-progress'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {step.status === 'completed' && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                {step.status === 'in-progress' && (
                  <div className="w-6 h-6 rounded-full border-3 border-blue-500 border-t-transparent animate-spin"></div>
                )}
                {step.status === 'pending' && (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-gray-900">Community</h3>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Connect with other Magic Bus students, share experiences, and build lasting friendships.
          </p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition-colors">
            Join Community Group
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-900">Resources</h3>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Access study materials, guides, and helpful resources to support your learning journey.
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors">
            Access Resources
          </button>
        </div>
      </div>
    </div>
  );
}
