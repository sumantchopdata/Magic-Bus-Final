import StudentLandingPage from './StudentLandingPage';

export default function StudentDashboard({ onLogout }: { onLogout: () => void }) {
  return <StudentLandingPage onLogout={onLogout} />;
}
