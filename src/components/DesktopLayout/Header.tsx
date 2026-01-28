import { LogOut, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  studentName: string;
  studentEmail: string;
  onLogout: () => void;
  onGoBack: () => void;
}

export default function Header({ studentName, studentEmail, onLogout, onGoBack }: HeaderProps) {
  return (
    <header
      className="h-40 bg-red-600/80 border-b border-gray-200 fixed top-0 left-0 right-0 z-30 flex items-center px-8 relative"
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white">Welcome Back, Sangam</h1>
        <p className="text-lg text-white mt-1">{studentEmail}</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 px-8 py-4 text-white hover:bg-white/20 rounded-lg transition-colors text-lg font-bold"
          title="Go back to home"
        >
          <ArrowLeft className="w-8 h-8" />
          Back
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-8 py-4 text-white hover:bg-white/20 rounded-lg transition-colors text-lg font-bold"
        >
          <LogOut className="w-8 h-8" />
          Logout
        </button>
      </div>
    </header>
  );
}
