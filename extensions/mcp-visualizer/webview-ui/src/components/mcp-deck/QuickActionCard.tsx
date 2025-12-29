import { ArrowRight } from 'lucide-react';
import { QuickAction } from '../../data';

interface QuickActionCardProps {
  action: QuickAction;
}

export function QuickActionCard({ action }: QuickActionCardProps) {
  const Icon = action.icon;

  return (
    <div className="flex flex-col h-full p-4 bg-white dark:bg-[#1e293b] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${action.iconBg}`}
      >
        <Icon className={`w-5 h-5 ${action.iconColor}`} />
      </div>

      <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1.5">{action.title}</h3>

      <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-4 flex-grow">
        {action.description}
      </p>

      <button className="flex items-center justify-center w-full py-2.5 rounded-xl bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors group">
        {action.buttonText}
        <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
