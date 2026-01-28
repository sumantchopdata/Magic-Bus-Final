import { GraduationCap, ShieldCheck, Target, Eye, Heart, Lightbulb, Users, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import StudentDashboard from './components/StudentDashboard';
import StudentLogin from './components/StudentLogin';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './lib/supabase';

type PageState = 'home' | 'student-login' | 'admin-login' | 'student-dashboard' | 'admin-dashboard';

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState<PageState>('home');
  const [loading, setLoading] = useState(true);

  const images = [
    '/pexels-photo-3231359.jpeg',
    '/ngo-for-education.jpg',
    '/indian-school-students-sitting-gruops-600nw-2668323179.webp'
  ];

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center p-8">
        <div className="max-w-2xl bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-red-500">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Configuration Required</h1>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
            <p className="text-gray-800 mb-4 font-semibold">
              Supabase environment variables are not loaded.
            </p>
            <p className="text-gray-700 text-sm mb-2">
              The dev server needs to be restarted to load the configuration.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
            <p className="font-semibold text-gray-700 mb-2">Environment Status:</p>
            <p className="text-gray-600">
              VITE_SUPABASE_URL: <span className="font-mono text-red-600">{supabaseUrl ? 'Set' : 'Missing'}</span>
            </p>
            <p className="text-gray-600">
              VITE_SUPABASE_ANON_KEY: <span className="font-mono text-red-600">{supabaseAnonKey ? 'Set' : 'Missing'}</span>
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Please restart the development server to continue.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const checkAuthState = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profile) {
          setCurrentPage('student-dashboard');
          setLoading(false);
          return;
        }

        const { data: admin } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (admin) {
          setCurrentPage('admin-dashboard');
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'student-dashboard') {
    return <StudentDashboard onLogout={handleLogout} />;
  }

  if (currentPage === 'admin-dashboard') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (currentPage === 'student-login') {
    return (
      <StudentLogin
        onGoBack={() => setCurrentPage('home')}
        onLoginSuccess={() => setCurrentPage('student-dashboard')}
      />
    );
  }

  if (currentPage === 'admin-login') {
    return (
      <AdminLogin
        onGoBack={() => setCurrentPage('home')}
        onLoginSuccess={() => setCurrentPage('admin-dashboard')}
      />
    );
  }

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-yellow-300 via-yellow-200 to-stone-100 p-4 pt-20 pb-24">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch" id="login">
            <div className="hidden lg:block animate-fade-in-left">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl h-full min-h-96">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Education image ${index + 1}`}
                    className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="text-center lg:text-left mb-10">
                <div className="flex justify-center lg:justify-start mb-6">
                  <img
                    src="/magic_bus_logo_with_childhood_to_livelihood_-_for_web_use.png"
                    alt="Magic Bus Foundation"
                    className="h-28 w-28 object-contain drop-shadow-lg animate-bounce-gentle"
                  />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 animate-slide-up">
                  Welcome to Magic Bus
                </h1>
                <p className="text-base md:text-lg text-gray-800 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  Childhood to Livelihood
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <LoginCard
                  title="Student Login"
                  description="Access your learning portal and track your progress"
                  icon={<GraduationCap className="w-12 h-12" />}
                  onClick={() => setCurrentPage('student-login')}
                  accentColor="student"
                />

                <LoginCard
                  title="Admin Login"
                  description="Manage students, courses, and administrative tasks"
                  icon={<ShieldCheck className="w-12 h-12" />}
                  onClick={() => setCurrentPage('admin-login')}
                  accentColor="admin"
                />
              </div>

              <footer className="text-center lg:text-left mt-8 text-gray-800">
                <p className="text-xs md:text-sm">
                  Need help? Contact support at{' '}
                  <a href="mailto:support@magicbus.org" className="font-semibold hover:text-red-600 transition-colors">
                    support@magicbus.org
                  </a>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <VisionMissionSection />
      <AboutSection />
    </div>
  );
}

interface LoginCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  accentColor: 'student' | 'admin';
}

function LoginCard({ title, description, icon, onClick, accentColor }: LoginCardProps) {
  const colorConfig = {
    student: {
      iconGradient: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      accentHover: 'group-hover:text-red-600',
      barGradient: 'bg-gradient-to-r from-red-500 to-red-600',
      borderAccent: 'group-hover:border-red-300',
    },
    admin: {
      iconGradient: 'from-blue-900 to-blue-950 hover:from-blue-950 hover:to-black',
      accentHover: 'group-hover:text-blue-900',
      barGradient: 'bg-gradient-to-r from-blue-900 to-blue-950',
      borderAccent: 'group-hover:border-blue-200',
    }
  };

  const config = colorConfig[accentColor];

  return (
    <button
      onClick={onClick}
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-left overflow-hidden border-2 border-transparent ${config.borderAccent}`}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-200 rounded-full -mr-20 -mt-20 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>

      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${config.iconGradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {description}
        </p>

        <div className={`flex items-center text-gray-900 font-semibold text-sm ${config.accentHover} transition-colors`}>
          <span>Continue</span>
          <svg
            className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 h-1 ${config.barGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
    </button>
  );
}

function VisionMissionSection() {
  const values = [
    { icon: Heart, label: 'Integrity', color: 'text-red-600' },
    { icon: Lightbulb, label: 'Innovation', color: 'text-yellow-600' },
    { icon: Users, label: 'Respect', color: 'text-green-600' },
    { icon: Award, label: 'Passion', color: 'text-orange-600' },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl shadow-lg">
            <div className="flex items-start gap-4">
              <Eye className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  A world where every child, regardless of their background, has access to quality education and opportunities to develop skills that lead to meaningful livelihoods and economic independence.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg">
            <div className="flex items-start gap-4">
              <Target className="w-8 h-8 text-blue-900 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  To transform the lives of underprivileged youth through comprehensive educational programs, skill development initiatives, and livelihood support that foster holistic growth and sustainable opportunities.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl shadow-lg">
            <div className="flex items-start gap-4">
              <Heart className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Core Values</h3>
                <div className="space-y-2">
                  {values.map(({ label }) => (
                    <div key={label} className="text-sm text-gray-700 font-medium">
                      • {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h4 className="text-center text-lg font-semibold text-gray-900 mb-8">What Drives Us</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, label, color }) => (
              <div key={label} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
                <Icon className={`w-10 h-10 ${color} mx-auto mb-3`} />
                <p className="font-semibold text-gray-900">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-28 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            About Magic Bus Foundation
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            Transforming lives through education, skill development, and livelihood opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="text-gray-700 space-y-4 order-2 md:order-1">
            <p className="text-base leading-relaxed">
              Magic Bus Foundation is dedicated to bridging the gap between childhood education and livelihood opportunities for underprivileged youth. We believe every child deserves access to quality education and the skills necessary to build a sustainable future.
            </p>
            <p className="text-base leading-relaxed">
              Through innovative programs and community partnerships, we empower students to realize their potential and contribute meaningfully to society.
            </p>
          </div>
          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <img
              src="/magic_bus_logo_with_childhood_to_livelihood_-_for_web_use.png"
              alt="Magic Bus Logo"
              className="h-48 w-48 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
