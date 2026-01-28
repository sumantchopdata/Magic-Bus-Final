import { Play, Clock, CheckCircle, Lock } from 'lucide-react';

interface TrainingModulesSectionProps {
  onProgressUpdate: () => void;
}

export default function TrainingModulesSection({ onProgressUpdate }: TrainingModulesSectionProps) {
  const modules = [
    {
      id: 1,
      title: 'Fundamentals of Skill Development',
      duration: '2 weeks',
      lessons: 8,
      completed: true,
      locked: false,
    },
    {
      id: 2,
      title: 'Communication & Soft Skills',
      duration: '3 weeks',
      lessons: 12,
      completed: false,
      locked: false,
    },
    {
      id: 3,
      title: 'Technical Skills Workshop',
      duration: '4 weeks',
      lessons: 15,
      completed: false,
      locked: false,
    },
    {
      id: 4,
      title: 'Advanced Topics',
      duration: '3 weeks',
      lessons: 10,
      completed: false,
      locked: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Training Modules</h2>
        <p className="text-gray-600">Complete these training modules to develop essential skills for your career</p>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-3">Your Progress</h3>
        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <div className="w-full bg-red-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all"
                style={{ width: '25%' }}
              ></div>
            </div>
          </div>
          <span className="text-lg font-bold text-red-600">1/4 Completed</span>
        </div>
      </div>

      <div className="space-y-3">
        {modules.map((module) => (
          <div
            key={module.id}
            className={`p-5 rounded-lg border transition-all flex items-center justify-between ${
              module.locked
                ? 'bg-gray-50 border-gray-200 opacity-60'
                : module.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="flex-grow flex items-center gap-4">
              <div className="flex-shrink-0">
                {module.locked ? (
                  <Lock className="w-5 h-5 text-gray-400" />
                ) : module.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Play className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {module.duration}
                  </span>
                  <span>{module.lessons} lessons</span>
                </div>
              </div>
            </div>

            <button
              disabled={module.locked}
              className={`px-4 py-2 rounded font-semibold text-sm transition-colors flex-shrink-0 ${
                module.locked
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : module.completed
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {module.locked ? 'Locked' : module.completed ? 'Review' : 'Start'}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-900 mb-3">Certificates</h4>
          <p className="text-sm text-blue-800 mb-4">
            Earn certificates upon completion of each module to showcase your skills.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
            View Certificates
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3">Learning Support</h4>
          <p className="text-sm text-gray-700 mb-4">
            Need help with a module? Connect with tutors and mentors for guidance.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
            Get Support
          </button>
        </div>
      </div>
    </div>
  );
}
