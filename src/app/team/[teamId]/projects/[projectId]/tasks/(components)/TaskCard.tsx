import { intlFormat } from 'date-fns';
import { CalendarDays, UserCircle } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import TasksActions from './TasksActions';
import TaskForm from './TaskForm';
import Badge, { ColorsType } from '@/components/ui/badge';
import { PopulatedTask } from './tasksColumns';
import { PRIORITY_COLORS } from '@/lib/consts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TaskCardProps {
  taskData: PopulatedTask;
  isDragging?: boolean;
}

const TaskCard = ({ taskData }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: taskData._id,
    data: {
      type: 'task',
      task: taskData,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const { title, description, dueDate, label, priority, assignee } = taskData;

  return (
    <TaskForm
      taskData={taskData}
      trigger={
        <li
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className='relative w-full min-w-[280px] max-w-[350px] space-y-2 bg-muted/20 p-2.5 mr-3 border border-border rounded-lg shadow-md md:cursor-pointer group touch-none list-none'
        >
          <div className='flex items-center justify-between'>
            <h3 className='font-medium'>{title}</h3>
            <div className='opacity-100 md:opacity-0 md:[&:has([data-state="open"])]:opacity-100 group-hover:opacity-100'>
              <TasksActions data={taskData} />
            </div>
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
            <span>
              {dueDate ? intlFormat(new Date(dueDate as number)) : '-'}
            </span>
          </p>
          <div className='flex items-center gap-2'>
            {assignee?._id ? (
              <div className='flex items-center gap-2'>
                <Avatar className='size-6'>
                  <AvatarFallback className='size-6'>
                    {assignee?.fullName.at(0)}
                  </AvatarFallback>
                  <AvatarImage
                    src={assignee?.profileImage}
                    alt='Profile photo'
                  />
                </Avatar>
                <p className='text-sm'>{assignee?.fullName}</p>
              </div>
            ) : (
              <>
                <UserCircle
                  className='size-4 text-muted-foreground'
                  strokeWidth={1.5}
                />
                <p>-</p>
              </>
            )}
          </div>
          <div className='space-x-2'>
            {label?.title && (
              <Badge
                decorated
                text={label.title as string}
                color={label.color as ColorsType}
              />
            )}
            {priority && (
              <Badge
                decorated
                text={priority as string}
                color={PRIORITY_COLORS[priority!] as ColorsType}
              />
            )}
          </div>
        </li>
      }
    />
  );
};

export default TaskCard;
