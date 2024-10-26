export type ColorsType =
  | 'red'
  | 'green'
  | 'blue'
  | 'gray'
  | 'purple'
  | 'orange'
  | 'yellow';

type BadgeType = {
  text: string;
  color: ColorsType;
  decorated?: boolean;
};

const getColorClass = (color: ColorsType) => {
  const colorClasses = {
    red: 'bg-red-200 text-red-700 border-red-700 dark:border-red-200 dark:bg-red-900 dark:text-red-200',
    blue: 'bg-blue-200 text-blue-700 border-blue-700 dark:border-blue-200 dark:bg-blue-900 dark:text-blue-200',
    green:
      'bg-green-200 text-green-800 border-green-800 dark:border-green-200 dark:bg-green-900 dark:text-green-200',
    gray: 'bg-gray-200 text-gray-700 border-gray-700 dark:border-gray-200 dark:bg-gray-700 dark:text-gray-200',
    purple:
      'bg-purple-200 text-purple-700 border-purple-700 dark:border-purple-200 dark:bg-purple-700 dark:text-purple-200',
    orange:
      'bg-orange-200 text-orange-800 border-orange-800 dark:border-orange-200 dark:bg-orange-700 dark:text-orange-200',
    yellow:
      'bg-yellow-100 text-yellow-700 border-yellow-700 dark:border-yellow-200 dark:bg-yellow-700 dark:text-yellow-200',
  };

  return colorClasses[color] || colorClasses.gray;
};

const Badge = ({ text, color, decorated = false }: BadgeType) => {
  return (
    <span
      className={`inline-flex capitalize items-center rounded-lg px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-nowrap ${getColorClass(
        color
      )}`}
    >
      {decorated && (
        <span
          className={`size-1.5 mr-1.5 border-[3.5px] ${getColorClass(
            color
          )} rounded-full`}
        ></span>
      )}
      {text}
    </span>
  );
};

export default Badge;
