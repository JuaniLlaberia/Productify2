import { PriorityEnum, RolesEnum, StatusEnum, TeamStatusEnum } from './enums';

export const COLORS = [
  { label: 'red', value: '#ef4444' },
  { label: 'rose', value: '#f87171' },
  { label: 'orange', value: '#f97316' },
  { label: 'yellow', value: '#fde047' },
  { label: 'pink', value: '#f472b6' },
  { label: 'sky', value: '#38bdf8' },
  { label: 'blue', value: '#3b82f6' },
  { label: 'purple', value: '#8b5cf6' },
  { label: 'fuchsia', value: '#d946ef' },
  { label: 'indigo', value: '#818cf8' },
  { label: 'green', value: '#22c55e' },
  { label: 'emerald', value: '#34d399' },
  { label: 'gray', value: '#9ca3af' },
  { label: 'slate', value: '#94a3b8' },
];

export const INITIAL_NUM_ITEMS = 10;

export const FILTERS = {
  priority: {
    label: 'Priority',
    field: 'priority',
    options: ['low', 'medium', 'high', 'urgent'],
  },
  status: {
    label: 'Status',
    field: 'status',
    options: ['backlog', 'todo', 'in-progress', 'completed', 'canceled'],
  },
  type: {
    label: 'Type',
    field: 'type',
    options: ['ui/ux', 'functional', 'performance', 'security', 'other'],
  },
};

export const STATUS_COLORS = {
  [StatusEnum.BACKLOG]: 'gray',
  [StatusEnum.TODO]: 'red',
  [StatusEnum.IN_PROGRESS]: 'blue',
  [StatusEnum.COMPLETED]: 'green',
  [StatusEnum.CANCELED]: 'gray',
};

export const PRIORITY_COLORS = {
  [PriorityEnum.LOW]: 'gray',
  [PriorityEnum.MEDIUM]: 'yellow',
  [PriorityEnum.HIGH]: 'orange',
  [PriorityEnum.URGENT]: 'red',
};

export const TEAM_STATUS_COLORS = {
  [TeamStatusEnum.ACTIVE]: 'green',
  [TeamStatusEnum.INACTIVE]: 'yellow',
  [TeamStatusEnum.MANTAINANCE]: 'red',
};

export const ROLE_COLORS = {
  [RolesEnum.OWNER]: 'red',
  [RolesEnum.ADMIN]: 'yellow',
  [RolesEnum.MEMBER]: 'blue',
};

export const COLUMNS = [
  {
    id: StatusEnum.BACKLOG,
    title: 'Backlog',
  },
  {
    id: StatusEnum.TODO,
    title: 'To Do',
  },
  {
    id: StatusEnum.IN_PROGRESS,
    title: 'In Progress',
  },
  {
    id: StatusEnum.COMPLETED,
    title: 'Completed',
  },
  {
    id: StatusEnum.CANCELED,
    title: 'Canceled',
  },
] as const;
