import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onGoBack: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onGoBack, onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: admin } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (!admin) {
          throw new Error('You do not have admin privileges.');
        }

        onLoginSuccess();
      }
    } catch (error: any) {
      setMessage(error.message || 'Invalid credentials or insufficient permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 text-white hover:text-blue-200 mb-8 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white mb-6 shadow-lg">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-blue-100">Manage Magic Bus Foundation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/30 text-white placeholder-blue-200 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/30 text-white placeholder-blue-200 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg text-sm ${
                  message.includes('successfully')
                    ? 'bg-green-500/20 text-green-200 border border-green-400'
                    : 'bg-red-500/20 text-red-200 border border-red-400'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 rounded-lg transition-all transform hover:shadow-lg mt-6"
            >
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

          <div className="pt-4 border-t border-white/20">
            <p className="text-center text-sm text-blue-100">
              Admin credentials required to access this panel
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-900/50 rounded-lg border border-blue-400/30">
          <p className="text-center text-xs text-blue-200">
            For demo purposes, use the admin test account or contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
}
