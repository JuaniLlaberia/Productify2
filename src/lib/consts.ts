import { PriorityEnum, StatusEnum } from './enums';

export const COLORS = [
  { label: 'red', value: '#ef4444' },
  { label: 'salmon', value: '#f87171' },
  { label: 'orange', value: '#f97316' },
  { label: 'yellow', value: '#fde047' },
  { label: 'pink', value: '#f472b6' },
  { label: 'sky', value: '#38bdf8' },
  { label: 'blue', value: '#3b82f6' },
  { label: 'purple', value: '#8b5cf6' },
  { label: 'fusia', value: '#d946ef' },
  { label: 'indigo', value: '#818cf8' },
  { label: 'green', value: '#22c55e' },
  { label: 'emerald', value: '#34d399' },
  { label: 'gray', value: '#9ca3af' },
  { label: 'slate', value: '#94a3b8' },
];

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
