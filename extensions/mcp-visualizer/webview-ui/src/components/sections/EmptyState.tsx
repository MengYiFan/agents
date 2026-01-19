/**
 * EmptyState 空状态组件
 *
 * 显示无权限或无内容时的提示
 */

import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ message = 'No content available.', icon }: EmptyStateProps) {
  return (
    <div className="empty-state flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="empty-state-icon mb-4 text-gray-400 dark:text-gray-500">
        {icon || <AlertCircle className="w-12 h-12" />}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{message}</p>
    </div>
  );
}
