'use client';

import { useMutation } from 'convex/react';
import { Edit, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { z } from 'zod';

import InputWrapper from '@/components/ui/input-wrapper';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';

type AssetFormProps = {
  assetName: string;
  assetId: Id<'assets'>;
  trigger?: React.ReactNode;
  onClose?: () => void;
};

const AssetForm = ({
  assetName,
  assetId,
  trigger,
  onClose,
}: AssetFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { teamId } = useParams<{
    teamId: Id<'teams'>;
  }>();

  const defaultValues = {
    name: assetName,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, 'You must provide a name for this asset'),
      })
    ),
    defaultValues,
  });

  const editAsset = useMutation(api.assets.updateAsset);

  const submitHandler = handleSubmit(async data => {
    try {
      await editAsset({ teamId, assetId, assetData: { name: data.name } });

      setIsOpen(false);
      onClose?.();
      toast.success(`Asset updated successfully`);
    } catch {
      toast.error(`Failed to update asset`);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size='sm'>
            <Edit className='size-4 mr-1.5' strokeWidth={2} />
            Edit asset
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitHandler} className='space-y-5'>
          <DialogHeader>
            <DialogTitle>Edit asset</DialogTitle>
          </DialogHeader>
          <fieldset className='space-y-2'>
            <InputWrapper
              inputId='name'
              label='Asset name'
              error={errors.name?.message as string}
            >
              <Input placeholder='Asset name' {...register('name')} />
            </InputWrapper>
          </fieldset>
          <DialogFooter className='flex items-center sm:justify-between'>
            <DialogClose asChild>
              <Button size='sm' variant='outline'>
                Cancel
              </Button>
            </DialogClose>
            <Button size='sm' disabled={isSubmitting} className='min-w-16'>
              {isSubmitting ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                'Update'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssetForm;
