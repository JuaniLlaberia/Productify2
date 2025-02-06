'use client';

import { CalendarDays } from 'lucide-react';

import Badge, { ColorsType } from '../ui/badge';
import { cn } from '@/lib/utils';
import { AnimatedList } from '../animated-list';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { PRIORITY_COLORS } from '@/lib/consts';
import { PriorityEnum } from '@/lib/enums';

type TaskType = {
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  label: {
    title: string;
    color: string;
  };
  priority: string;
};

let paths: TaskType[] = [
  {
    title: 'Build landing page',
    description: '',
    dueDate: 'Today',
    assignee: 'John Doe',
    label: {
      title: 'UI/UX',
      color: 'red',
    },
    priority: 'low',
  },
  {
    title: 'Refactor authentication (OAuth)',
    description: '',
    dueDate: '12/03/2025',
    assignee: 'James Lopez',
    label: {
      title: 'Functionalities',
      color: 'purple',
    },
    priority: 'high',
  },
  {
    title: 'Implement dark mode',
    description: 'Add a theme toggle and persist user preference.',
    dueDate: '15/03/2025',
    assignee: 'Sophia Carter',
    label: {
      title: 'UI/UX',
      color: 'blue',
    },
    priority: 'medium',
  },
  {
    title: 'Optimize database queries',
    description: 'Reduce response time by indexing and query optimization.',
    dueDate: '20/03/2025',
    assignee: 'Liam Johnson',
    label: {
      title: 'Performance',
      color: 'red',
    },
    priority: 'high',
  },
  {
    title: 'Set up CI/CD pipeline',
    description: 'Automate testing and deployment for the project.',
    dueDate: '10/03/2025',
    assignee: 'Emma Williams',
    label: {
      title: 'DevOps',
      color: 'green',
    },
    priority: 'high',
  },
  {
    title: 'Write unit tests for user service',
    description:
      'Ensure core user functionalities are covered with Jest tests.',
    dueDate: '18/03/2025',
    assignee: 'Noah Smith',
    label: {
      title: 'Testing',
      color: 'yellow',
    },
    priority: 'medium',
  },
  {
    title: 'Update API documentation',
    description: 'Ensure all endpoints are properly documented in Swagger.',
    dueDate: '22/03/2025',
    assignee: 'Olivia Brown',
    label: {
      title: 'Documentation',
      color: 'orange',
    },
    priority: 'low',
  },
];

paths = Array.from({ length: 10 }, () => paths).flat();

const Task = ({
  title,
  description,
  dueDate,
  assignee,
  label,
  priority,
}: TaskType) => {
  return (
    <figure
      className={cn(
        'relative w-full min-w-[380px] max-w-[450px] space-y-2 bg-muted/20 p-2.5 mr-3 border border-border rounded-lg shadow-md md:cursor-pointer group touch-none list-none',
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]'
      )}
    >
      <div className='flex items-center justify-between'>
        <h3 className='font-medium'>{title}</h3>
      </div>
      <p className='text-muted-foreground text-sm line-clamp-3 pb-3'>
        {description}
      </p>
      <p className='flex items-center gap-2 text-sm'>
        <span>
          <CalendarDays
            className='size-4 text-muted-foreground'
            strokeWidth={1.5}
          />
        </span>
        <span>{dueDate}</span>
      </p>
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2'>
          <Avatar className='size-6'>
            <AvatarFallback className='size-6'>{assignee.at(0)}</AvatarFallback>
          </Avatar>
          <p className='text-sm'>{assignee}</p>
        </div>
      </div>
      <div className='space-x-2'>
        <Badge
          decorated
          text={label.title}
          color={label.color as ColorsType}
        />

        <Badge
          decorated
          text={priority}
          color={PRIORITY_COLORS[priority as PriorityEnum] as ColorsType}
        />
      </div>
    </figure>
  );
};

export const TaskListAnimation = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-lg border bg-background md:shadow-xl',
        className
      )}
    >
      <AnimatedList>
        {paths.map((item, idx) => (
          <Task
            {...item}
            key={idx}
          />
        ))}
      </AnimatedList>
    </div>
  );
};
