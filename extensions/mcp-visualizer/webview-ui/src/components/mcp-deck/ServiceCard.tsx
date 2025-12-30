import { Service } from '../../data';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;
  const isActive = service.status === 'active';

  return (
    <div
      className={`relative group flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-white dark:bg-[#1e293b] shadow-sm border border-gray-100 dark:border-gray-700/50'
          : 'bg-gray-50 dark:bg-slate-800/50 border border-transparent opacity-60 hover:opacity-100'
      }`}
      title={service.name}
    >
      <div
        className={`flex items-center justify-center w-5 h-5 ${!isActive ? 'grayscale filter' : ''}`}
      >
        {typeof Icon === 'string' ? (
          <img src={Icon} alt={service.name} className="w-4 h-4 object-contain" />
        ) : (
          <Icon
            className={`w-4 h-4 transition-colors duration-200 ${
              isActive ? service.color || 'text-purple-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
        )}
      </div>
    </div>
  );
}
