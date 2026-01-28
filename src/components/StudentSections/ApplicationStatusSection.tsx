import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ProgressStatus {
  registration_complete: boolean;
  identification_complete: boolean;
  onboarding_complete: boolean;
  training_complete: boolean;
  placement_complete: boolean;
}

interface ApplicationStatusSectionProps {
  progress: ProgressStatus;
}

export default function ApplicationStatusSection({ progress }: ApplicationStatusSectionProps) {
  const stages = [
    {
      name: 'Registration',
      description: 'Complete your profile information',
      completed: progress.registration_complete,
      order: 1,
    },
    {
      name: 'Identification',
      description: 'Verify your identity with documents',
      completed: progress.identification_complete,
      order: 2,
    },
    {
      name: 'Onboarding',
      description: 'Get started with orientation',
      completed: progress.onboarding_complete,
      order: 3,
    },
    {
      name: 'Training',
      description: 'Complete training modules',
      completed: progress.training_complete,
      order: 4,
    },
    {
      name: 'Placement',
      description: 'Access placement opportunities',
      completed: progress.placement_complete,
      order: 5,
    },
  ];

  const completionPercentage = Math.round(
    (stages.filter(s => s.completed).length / stages.length) * 100
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Application Status</h2>
        <p className="text-gray-600">Track your progress through the Magic Bus program stages</p>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">Overall Progress</h3>
          <span className="text-2xl font-bold text-red-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-red-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.name}>
            <div
              className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                stage.completed
                  ? 'bg-green-50 border-green-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex-shrink-0">
                {stage.completed ? (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white font-bold">
                    {stage.order}
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <h4 className="font-bold text-gray-900">{stage.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
              </div>

              <div className="flex-shrink-0">
                {stage.completed ? (
                  <div className="text-green-600 font-semibold text-sm">Completed</div>
                ) : index === 0 || stages[index - 1].completed ? (
                  <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm">
                    <Clock className="w-4 h-4" />
                    In Progress
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Locked
                  </div>
                )}
              </div>
            </div>

            {index < stages.length - 1 && (
              <div className="h-8 border-l-2 border-gray-300 ml-5"></div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-bold text-blue-900 mb-3">Quick Tips</h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Complete registration to unlock next stages</li>
            <li>✓ Submit all required documents on time</li>
            <li>✓ Participate actively in training modules</li>
            <li>✓ Check placement opportunities regularly</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3">Need Help?</h4>
          <p className="text-sm text-gray-700 mb-4">
            If you have any questions about your application status or need assistance, our support team is here to help.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
