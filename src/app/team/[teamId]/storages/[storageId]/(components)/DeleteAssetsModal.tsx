'use client';

import { AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';

type DeleteAssetsModalProps = {
  teamId: Id<'teams'>;
  assets: {
    assetId: Id<'assets'>;
    fileIdInStorage: Id<'_storage'>;
  }[];
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const DeleteAssetsModal = ({
  teamId,
  assets,
  onSuccess,
  trigger,
}: DeleteAssetsModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deleteAssets = useMutation(api.assets.deleteAssets);

  const assetsLength = assets.length;

  const handleDeletion = async () => {
    setIsLoading(true);

    try {
      await deleteAssets({ teamId, assets });

      onSuccess?.();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(
        `Failed to delete ${assetsLength === 1 ? 'assets' : 'asset'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size='sm' variant='destructive'>
            <Trash2 className='size-4 mr-1.5' strokeWidth={1.5} />
            {assetsLength === 1 ? 'Delete asset' : 'Delete all'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {assetsLength > 1 ? 'assets' : 'asset'}
          </DialogTitle>
          <DialogDescription>
            You are about to delete{' '}
            {assetsLength > 1 ? 'these assets' : 'this asset'}. All data related
            will be deleted.
          </DialogDescription>
        </DialogHeader>
        <Alert variant='destructive'>
          <AlertCircle className='size-4' strokeWidth={1.5} />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>This action is not reversible.</AlertDescription>
        </Alert>
        <DialogFooter>
          <DialogClose asChild>
            <Button size='sm' variant='outline' disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={isLoading}
            size='sm'
            variant='destructive'
            onClick={handleDeletion}
            className='min-w-16'
          >
            {isLoading ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              'Confirm'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAssetsModal;
