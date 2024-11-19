'use client';

import { useMutation, useQuery } from 'convex/react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '../../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../../convex/_generated/dataModel';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const SubTasksList = ({
  teamId,
  projectId,
  parentId,
}: {
  teamId: Id<'teams'>;
  projectId: Id<'projects'>;
  parentId: Id<'tasks'>;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isCreatingSubtask, setIsCreatingSubtask] = useState(false);
  const [optimisticSubTasks, setOptimisticSubTasks] = useState<any[]>([]);

  const createSubTask = useMutation(api.subtasks.createSubTask);
  const deleteSubTask = useMutation(api.subtasks.deleteSubTask);
  const updateSubTask = useMutation(api.subtasks.updateSubTask);

  const subTasks = useQuery(api.subtasks.getSubTasks, {
    teamId,
    parentTask: parentId,
  });

  useEffect(() => {
    if (subTasks) {
      setOptimisticSubTasks(subTasks);
    }
  }, [subTasks]);

  const handleCheckChange = async (
    taskId: Id<'subTasks'>,
    checked: boolean
  ) => {
    setOptimisticSubTasks(prev =>
      prev.map(task =>
        task._id === taskId ? { ...task, completed: checked } : task
      )
    );

    try {
      await updateSubTask({
        teamId,
        subTaskId: taskId,
        subTaskData: { completed: checked, parentId },
      });
    } catch {
      // Revert optimistic update on error
      setOptimisticSubTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, completed: !checked } : task
        )
      );
      toast.error('Failed to update sub-task');
    }
  };

  if (!subTasks)
    return (
      <div className='space-y-2'>
        <Skeleton className='w-full h-8' />
        <Skeleton className='w-full h-8' />
        <Skeleton className='w-full h-8' />
      </div>
    );

  return (
    <section>
      <div className='flex items-center justify-between'>
        <Button
          variant='ghost'
          size='sm'
          className='text-sm'
          onClick={() =>
            setIsExpanded(prev => {
              if (!prev) setIsCreatingSubtask(false);
              return !prev;
            })
          }
        >
          <ChevronDown
            className={cn(
              'size-4 mr-1.5 transition-transform',
              !isExpanded ? '-rotate-90' : null
            )}
          />{' '}
          Sub-tasks ({subTasks?.length})
        </Button>

        <Button
          size='icon'
          variant='ghost'
          onClick={() => {
            setIsExpanded(true);
            setIsCreatingSubtask(true);
          }}
        >
          <Plus className='size-4' strokeWidth={2} />
        </Button>
      </div>
      {isExpanded && (
        <>
          <Separator className='my-1.5' />
          <ul className='mt-3 space-y-2'>
            {optimisticSubTasks.length > 0
              ? optimisticSubTasks.map(task => (
                  <li key={task._id} className='flex items-start gap-2.5'>
                    <Checkbox
                      className='size-4 flex-shrink-0 mt-1'
                      checked={task.completed}
                      onCheckedChange={checked =>
                        handleCheckChange(task._id, Boolean(checked))
                      }
                    />
                    <p
                      className={cn(
                        'text-sm line-clamp-4 w-full',
                        task.completed && 'line-through'
                      )}
                    >
                      {task.title}
                    </p>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() =>
                        deleteSubTask({ teamId, subTaskId: task._id })
                      }
                      className='flex-shrink-0'
                    >
                      <Trash2 className='size-4' strokeWidth={1.5} />
                    </Button>
                  </li>
                ))
              : !isCreatingSubtask && (
                  <div>
                    <p className='text-sm text-muted-foreground text-center py-4'>
                      There are no sub-tasks
                    </p>
                  </div>
                )}
            {isCreatingSubtask && (
              <li className='flex items-start gap-2.5'>
                <Checkbox
                  className='size-5 flex-shrink-0 mt-1.5'
                  checked={false}
                />
                <Input
                  autoFocus
                  type='text'
                  placeholder='New subtask'
                  onBlur={e => {
                    try {
                      if (e.target.value.trim().length > 0) {
                        createSubTask({
                          teamId,
                          projectId,
                          parentId,
                          title: e.target.value,
                          completed: false,
                        });

                        setIsCreatingSubtask(false);
                      }
                    } catch {
                      toast.error('Failed to create sub-task');
                    }
                  }}
                  className='text-sm line-clamp-3 flex-1'
                />
              </li>
            )}
          </ul>
        </>
      )}
    </section>
  );
};

export default SubTasksList;
