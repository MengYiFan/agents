import { Service } from '../../data';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 min-w-[120px]">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-50 dark:bg-gray-800 overflow-hidden">
          {typeof Icon === 'string' ? (
            <img src={Icon} alt={service.name} className="w-3.5 h-3.5" />
          ) : (
            <Icon className="w-3.5 h-3.5 text-purple-500" /> /* Fallback/Default color if not specified */
          )}
        </div>
        <span className="font-semibold text-xs text-gray-900 dark:text-gray-100">
          {service.name}
        </span>
      </div>
      <div className="relative flex items-center justify-center w-2 h-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
    </div>
  );
}
