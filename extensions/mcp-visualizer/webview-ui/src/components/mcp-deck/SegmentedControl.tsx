import { LayoutGrid, Workflow } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface SegmentedControlProps {
  activeTab: 'list' | 'workflow';
  onChange: (tab: 'list' | 'workflow') => void;
}

export function SegmentedControl({ activeTab, onChange }: SegmentedControlProps) {
  const { t } = useTranslation();

  return (
    <div className="flex p-1 bg-gray-100 dark:bg-[#1e293b] rounded-xl">
      <button
        type="button"
        onClick={() => onChange('list')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
          activeTab === 'list'
            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        {t('home.tabs.explore')}
      </button>
      <button
        type="button"
        onClick={() => onChange('workflow')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
          activeTab === 'workflow'
            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        <Workflow className="w-3.5 h-3.5" />
        {t('home.tabs.workflow')}
      </button>
    </div>
  );
}
