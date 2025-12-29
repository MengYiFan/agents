import { ArrowRight } from 'lucide-react';
import { QuickAction } from '../../data';

interface QuickActionCardProps {
  action: QuickAction;
}

export function QuickActionCard({ action }: QuickActionCardProps) {
  const Icon = action.icon;

  return (
    <div className="flex flex-col h-full p-5 bg-white dark:bg-[#1e293b] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${action.iconBg}`}
      >
        <Icon className={`w-6 h-6 ${action.iconColor}`} />
      </div>

      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">{action.title}</h3>

      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
        {action.description}
      </p>

      <button className="flex items-center justify-center w-full py-3 rounded-xl bg-gray-900 dark:bg-gray-700 text-white font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors group">
        {action.buttonText}
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
