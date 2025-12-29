import { ArrowRight } from 'lucide-react';
import { MCP } from '../../data';

interface MCPCardProps {
  item: MCP;
}

export function MCPCard({ item }: MCPCardProps) {
  const Icon = item.icon;
  // Dynamic action icon based on data or default to ArrowRight
  const ActionIcon = item.actionIcon || ArrowRight;

  return (
    <div className="group flex h-full items-center justify-between p-3 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3">
        {/* Icon Box */}
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${item.iconBg}`}>
          <Icon className={`w-5 h-5 ${item.iconColor}`} />
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${item.statusColor.replace('text-', 'bg-')}`}
            ></span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {item.description}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <ActionIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
