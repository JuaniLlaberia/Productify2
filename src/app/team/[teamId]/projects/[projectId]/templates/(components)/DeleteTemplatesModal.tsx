'use client';

import { AlertCircle } from 'lucide-react';
import { useMutation } from 'convex/react';

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { api } from '../../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../../convex/_generated/dataModel';

const DeleteTemplatesModal = ({
  teamId,
  ids,
  onSuccess,
}: {
  teamId: Id<'teams'>;
  ids: Id<'templates'>[];
  onSuccess?: () => void;
}) => {
  const deleteTemplates = useMutation(api.templates.deleteTemplate);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Delete {ids.length > 1 ? 'templates' : 'template'}
        </DialogTitle>
        <DialogDescription>
          You are about to delete{' '}
          {ids.length > 1 ? 'these templates' : 'this template'}. All data
          related will be deleted.
        </DialogDescription>
      </DialogHeader>
      <Alert variant='destructive'>
        <AlertCircle className='size-4' strokeWidth={1.5} />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This action is not reversible.</AlertDescription>
      </Alert>
      <DialogFooter>
        <DialogClose asChild>
          <Button size='sm' variant='outline'>
            Cancel
          </Button>
        </DialogClose>
        <Button
          size='sm'
          variant='destructive'
          onClick={async () => {
            await deleteTemplates({ teamId, templatesIds: ids });
            onSuccess?.();
          }}
        >
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteTemplatesModal;
