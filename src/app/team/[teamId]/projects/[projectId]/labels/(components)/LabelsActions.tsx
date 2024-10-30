'use client';

import { Copy, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { useState } from 'react';

import LabelsForm from './LabelsForm';
import DeleteLabelsModal from './DeleteLabelsModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '../../../../../../../../convex/_generated/api';
import { Doc } from '../../../../../../../../convex/_generated/dataModel';

const LabelsActions = ({ data }: { data: Doc<'labels'> }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Duplicate functionality
  const createLabel = useMutation(api.labels.createLabel);
  const handleDuplicateTask = async () => {
    const promise = createLabel({
      title: data.title,
      color: data.color,
      teamId: data.teamId,
      projectId: data.projectId,
    });

    toast.promise(promise, {
      loading: 'Duplicating label',
      success: 'Label duplicated successfully',
      error: 'Failed to duplicate label',
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
        {/* Edit button */}
        <LabelsForm
          labelData={data}
          trigger={
            <DropdownMenuItem
              className='text-xs'
              onSelect={e => e.preventDefault()}
            >
              <Edit className='size-3 mr-2' strokeWidth={1.5} />
              Edit label
            </DropdownMenuItem>
          }
          onClose={() => setIsDropdownOpen(false)}
        />
        {/* Duplicate button */}
        <DropdownMenuItem className='text-xs' onClick={handleDuplicateTask}>
          <Copy className='size-3 mr-2' strokeWidth={1.5} />
          Duplicate
        </DropdownMenuItem>
        {/* Remove button */}
        <DeleteLabelsModal
          teamId={data.teamId}
          ids={[data._id]}
          trigger={
            <DropdownMenuItem
              className='text-xs'
              onSelect={e => e.preventDefault()}
            >
              <Trash2 className='size-3 mr-2' strokeWidth={1.5} />
              Delete label
            </DropdownMenuItem>
          }
          onSuccess={() => setIsDropdownOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LabelsActions;
