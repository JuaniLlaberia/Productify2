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
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Doc } from '../../../../../../../../convex/_generated/dataModel';

const LabelsActions = ({ data }: { data: Doc<'labels'> }) => {
  // Dialog states
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [removeDialog, setRemoveDialog] = useState<boolean>(false);
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
    <>
      <DropdownMenu>
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
          <DropdownMenuItem
            className='text-xs'
            onClick={() => setEditDialog(true)}
          >
            <Edit className='size-3 mr-2' strokeWidth={1.5} />
            Edit label
          </DropdownMenuItem>
          {/* Duplicate button */}
          <DropdownMenuItem className='text-xs' onClick={handleDuplicateTask}>
            <Copy className='size-3 mr-2' strokeWidth={1.5} />
            Duplicate
          </DropdownMenuItem>
          {/* Remove button */}
          <DropdownMenuItem
            className='text-xs'
            onClick={() => setRemoveDialog(true)}
          >
            <Trash2 className='size-3 mr-2' strokeWidth={1.5} />
            Delete label
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      {/* Edit */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <LabelsForm labelData={data} />
        </DialogContent>
      </Dialog>
      {/* Remove */}
      <Dialog open={removeDialog} onOpenChange={setRemoveDialog}>
        <DeleteLabelsModal teamId={data.teamId} ids={[data._id]} />
      </Dialog>
    </>
  );
};

export default LabelsActions;
