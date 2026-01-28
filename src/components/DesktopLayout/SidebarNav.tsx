import { FileCheck, CheckCircle, User, BookOpen, Briefcase, Lock, Check } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: JSX.Element;
  completed: boolean;
  disabled: boolean;
}

interface SidebarNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  items: NavItem[];
}

export default function SidebarNav({ activeSection, onSectionChange, items }: SidebarNavProps) {
  return (
    <aside className="w-96 bg-white border-r border-gray-200 fixed left-0 top-40 bottom-0 overflow-y-auto">
      <nav className="p-6 space-y-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onSectionChange(item.id)}
            disabled={item.disabled}
            className={`w-full flex items-center gap-6 px-8 py-6 rounded-xl transition-all text-left font-semibold text-xl ${
              activeSection === item.id
                ? 'bg-red-50 text-red-700 border-l-4 border-red-600'
                : 'text-gray-700 hover:bg-gray-50'
            } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-gray-500">
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
            {item.completed && <Check className="w-8 h-8 text-green-500 flex-shrink-0" />}
            {item.disabled && <Lock className="w-8 h-8 text-gray-400 flex-shrink-0" />}
          </button>
        ))}
      </nav>
    </aside>
  );
}
