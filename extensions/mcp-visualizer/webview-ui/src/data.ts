import {
  LucideIcon,
  LayoutGrid,
  Figma,
  BarChart3,
  MessageSquare,
  Book,
  Code,
  RefreshCw,
  Play,
  Eye,
} from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  icon: string | LucideIcon;
  status: 'active' | 'inactive';
  color?: string;
}

export interface MCP {
  id: string;
  name: string;
  description: string;
  status: string;
  statusColor: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  actionIcon: LucideIcon;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string; // e.g., 'bg-emerald-100 dark:bg-emerald-900/30'
  iconColor: string; // e.g., 'text-emerald-600 dark:text-emerald-400'
  buttonText: string;
}

// Mock Data
export const activeServices: Service[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
    status: 'active',
  },
  { id: 'figma', name: 'Figma', icon: Figma, status: 'active' },
  { id: 'grafana', name: 'Grafana', icon: BarChart3, status: 'active', color: 'text-orange-500' },
];

export const availableMCPs: MCP[] = [
  {
    id: 'grafana',
    name: 'Grafana',
    description: 'Connected',
    status: 'connected',
    statusColor: 'text-emerald-500',
    icon: BarChart3,
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    actionIcon: Eye, // Arrow/Eye
  },
  {
    id: 'codereview',
    name: 'Code review',
    description: 'Auto-check',
    status: 'autocheck',
    statusColor: 'text-blue-500',
    icon: MessageSquare,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    actionIcon: Play,
  },
  {
    id: 'guidelines',
    name: 'Code guidelines',
    description: 'Rules & Standards',
    status: 'standard',
    statusColor: 'text-gray-500',
    icon: Book,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    actionIcon: Eye,
  },
];

export const quickActions: QuickAction[] = [
  {
    id: 'inject-rules',
    title: 'Inject Code Rules',
    description:
      'Inject default code standards into .github/prompts. Customizable via project config.',
    icon: Code,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    buttonText: 'Inject Rules',
  },
  {
    id: 'update-context',
    title: 'Update context7',
    description: 'Scan package.json dependencies and write matching context7 prompts.',
    icon: RefreshCw,
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    buttonText: 'Update Context',
  },
];
