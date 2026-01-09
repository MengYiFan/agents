import { ArrowRight } from 'lucide-react';
import { QuickAction } from '@/data';

interface QuickActionCardProps {
  action: QuickAction;
}

export function QuickActionCard({ action }: QuickActionCardProps) {
  const Icon = action.icon;

  return (
    <div className="quick-action-card flex items-start gap-3 p-4 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
      {/* 左侧图标 */}
      <div
        className={`quick-action-icon flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${action.iconBg}`}
      >
        <Icon className={`w-5 h-5 ${action.iconColor}`} />
      </div>

      {/* 右侧内容 */}
      <div className="quick-action-content flex flex-col flex-1 min-w-0">
        <h3 className="quick-action-title font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">
          {action.title}
        </h3>
        <p className="quick-action-desc text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-3">
          {action.description}
        </p>
        <button className="quick-action-btn flex items-center justify-center w-full py-2 rounded-xl bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors group">
          {action.buttonText}
          <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
