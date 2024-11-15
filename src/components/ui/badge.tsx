import { getColorClass } from '@/lib/helpers';

export type ColorsType =
  | 'red'
  | 'green'
  | 'blue'
  | 'gray'
  | 'purple'
  | 'orange'
  | 'yellow'
  | 'rose'
  | 'pink'
  | 'sky'
  | 'emerald'
  | 'fuchsia'
  | 'indigo'
  | 'slate';

type BadgeType = {
  text: string;
  color: ColorsType;
  decorated?: boolean;
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
