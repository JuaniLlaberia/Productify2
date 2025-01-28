'use client';

import { Copy, Edit, MoreHorizontal, SendToBack, Trash2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { useState } from 'react';

import DeleteReportsModal from './DeleteReportsModal';
import ReportsForm from './ReportsForm';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '../../../../../../../../convex/_generated/api';
import { Doc } from '../../../../../../../../convex/_generated/dataModel';

const ReportsActions = ({ data }: { data: Doc<'reports'> }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Duplicate functionality
  const createReport = useMutation(api.reports.createReport);
  const handleDuplicateTask = async () => {
    const promise = createReport({
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
      teamId: data.teamId,
      projectId: data.projectId,
    });

    toast.promise(promise, {
      loading: 'Duplicating report',
      success: 'Report duplicated successfully',
      error: 'Failed to duplicate report',
    });
  };

  // Transform into task functionality
  const createTask = useMutation(api.tasks.createTask);
  const deleteReport = useMutation(api.reports.deleteReports);
  const handleTransformToTask = () => {
    const promise = Promise.all([
      createTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: 'backlog',
        teamId: data.teamId,
        projectId: data.projectId,
      }),
      deleteReport({ teamId: data.teamId, reporstIds: [data._id] }),
    ]);

    toast.promise(promise, {
      loading: 'Transforming report into task',
      success: 'Report transformed successfully',
      error: 'Failed to transform report',
    });
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='size-6 p-0 hover:bg-muted'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal
            className='size-4 text-muted-foreground'
            strokeWidth={1.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <ReportsForm
          reportData={data}
          trigger={
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Edit className='size-3.5 mr-2' strokeWidth={1.5} />
              Edit report
            </DropdownMenuItem>
          }
          onClose={() => setIsDropdownOpen(false)}
        />
        {/* Transform to task button */}
        <DropdownMenuItem onClick={handleTransformToTask}>
          <SendToBack className='size-3.5 mr-2' strokeWidth={1.5} />
          Transform to task
        </DropdownMenuItem>
        {/* Duplicate button */}
        <DropdownMenuItem onClick={handleDuplicateTask}>
          <Copy className='size-3.5 mr-2' strokeWidth={1.5} />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteReportsModal
          teamId={data.teamId}
          ids={[data._id]}
          trigger={
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Trash2 className='size-3.5 mr-2' strokeWidth={1.5} />
              Delete report
            </DropdownMenuItem>
          }
          onSuccess={() => setIsDropdownOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReportsActions;
