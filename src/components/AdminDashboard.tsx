import { useState } from 'react';
import { LogOut, Users, BarChart3, Settings, FileText } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'reports' | 'settings'>('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Magic Bus Admin</h1>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-64 bg-slate-800 p-6 space-y-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Students', value: '0', color: 'from-blue-500 to-blue-600' },
                  { label: 'Active Registrations', value: '0', color: 'from-green-500 to-green-600' },
                  { label: 'In Training', value: '0', color: 'from-yellow-500 to-yellow-600' },
                  { label: 'Placements', value: '0', color: 'from-purple-500 to-purple-600' },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg`}
                  >
                    <p className="text-sm font-semibold opacity-90">{stat.label}</p>
                    <p className="text-4xl font-bold mt-2">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-700 rounded-lg p-6 text-gray-300">
                <p>Coming soon: Dashboard analytics and metrics</p>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Student Management</h2>
              <div className="bg-slate-700 rounded-lg p-8 text-gray-300 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Student management features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Reports & Analytics</h2>
              <div className="bg-slate-700 rounded-lg p-8 text-gray-300 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Reports and analytics features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Settings</h2>
              <div className="bg-slate-700 rounded-lg p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-600 rounded-lg">
                    <span className="text-white font-semibold">System Settings</span>
                    <span className="text-gray-400">Configure system parameters</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-600 rounded-lg">
                    <span className="text-white font-semibold">User Management</span>
                    <span className="text-gray-400">Manage admin users</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-600 rounded-lg">
                    <span className="text-white font-semibold">Audit Logs</span>
                    <span className="text-gray-400">View system activity</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
