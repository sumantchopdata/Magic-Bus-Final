import { Briefcase, MapPin, Clock, TrendingUp } from 'lucide-react';

interface PlacementSectionProps {
  onProgressUpdate: () => void;
}

export default function PlacementSection({ onProgressUpdate }: PlacementSectionProps) {
  const opportunities = [
    {
      id: 1,
      title: 'Software Developer - Internship',
      company: 'Tech Solutions Inc.',
      location: 'Remote',
      duration: '3-6 months',
      stipend: '₹15,000/month',
      new: true,
    },
    {
      id: 2,
      title: 'Business Analyst - Full-time',
      company: 'Global Finance Corp',
      location: 'Bangalore',
      duration: 'Permanent',
      salary: '₹4.5-5.5 LPA',
      new: true,
    },
    {
      id: 3,
      title: 'Data Analyst - Contract',
      company: 'Analytics Pro',
      location: 'Mumbai',
      duration: '6 months',
      stipend: '₹20,000/month',
      new: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Placement Support & Opportunities</h2>
        <p className="text-gray-600">Access job opportunities and get support for your career placement</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h4 className="text-3xl font-bold text-blue-600 mb-1">12</h4>
          <p className="text-sm text-gray-700">Active Opportunities</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h4 className="text-3xl font-bold text-green-600 mb-1">85%</h4>
          <p className="text-sm text-gray-700">Placement Success Rate</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="text-3xl font-bold text-gray-900 mb-1">₹4.2L</h4>
          <p className="text-sm text-gray-700">Average Package</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Latest Opportunities</h3>
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div key={opp.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-bold text-gray-900">{opp.title}</h4>
                    {opp.new && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{opp.company}</p>
                </div>
                <Briefcase className="w-6 h-6 text-red-600 flex-shrink-0" />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4" />
                  {opp.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4" />
                  {opp.duration}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-green-600">
                  {opp.salary || opp.stipend}
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-blue-900">Career Guidance</h4>
          </div>
          <p className="text-sm text-blue-800 mb-4">
            Get personalized career guidance and resume building support from our mentors.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
            Schedule Session
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-gray-600" />
            <h4 className="font-bold text-gray-900">Interview Prep</h4>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Prepare for interviews with mock sessions and technical assessments.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
            Start Practice
          </button>
        </div>
      </div>
    </div>
  );
}
