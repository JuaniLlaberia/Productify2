import { ColorsType } from '@/components/ui/badge';

export const getColorClass = (color: ColorsType) => {
  const colorClasses = {
    red: 'bg-red-200 text-red-700 border-red-700 dark:border-red-200 dark:bg-red-900 dark:text-red-200',
    rose: 'bg-rose-200 text-rose-700 border-rose-700 dark:border-rose-200 dark:bg-rose-900 dark:text-rose-200',
    pink: 'bg-pink-200 text-pink-700 border-pink-700 dark:border-pink-200 dark:bg-pink-900 dark:text-pink-200',
    blue: 'bg-blue-200 text-blue-700 border-blue-700 dark:border-blue-200 dark:bg-blue-900 dark:text-blue-200',
    sky: 'bg-sky-200 text-sky-700 border-sky-700 dark:border-sky-200 dark:bg-sky-900 dark:text-sky-200',
    emerald:
      'bg-emerald-200 text-emerald-700 border-emerald-700 dark:border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200',
    fuchsia:
      'bg-fuchsia-200 text-fuchsia-700 border-fuchsia-700 dark:border-fuchsia-200 dark:bg-fuchsia-900 dark:text-fuchsia-200',
    indigo:
      'bg-indigo-200 text-indigo-700 border-indigo-700 dark:border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200',
    green:
      'bg-green-200 text-green-800 border-green-800 dark:border-green-200 dark:bg-green-900 dark:text-green-200',
    gray: 'bg-gray-200 text-gray-700 border-gray-700 dark:border-gray-200 dark:bg-gray-700 dark:text-gray-200',
    slate:
      'bg-slate-200 text-slate-700 border-slate-700 dark:border-slate-200 dark:bg-slate-700 dark:text-slate-200',
    purple:
      'bg-purple-200 text-purple-700 border-purple-700 dark:border-purple-200 dark:bg-purple-700 dark:text-purple-200',
    orange:
      'bg-orange-200 text-orange-800 border-orange-800 dark:border-orange-200 dark:bg-orange-700 dark:text-orange-200',
    yellow:
      'bg-yellow-100 text-yellow-700 border-yellow-700 dark:border-yellow-200 dark:bg-yellow-700 dark:text-yellow-200',
  };

  return colorClasses[color] || colorClasses.gray;
};
