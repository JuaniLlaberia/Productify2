'use client';

import Dropzone from 'react-dropzone';
import { useParams } from 'next/navigation';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { type ReactElement, useState } from 'react';
import { toast } from 'sonner';
import { CloudUpload, FileText, ImageIcon, Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { api } from '../../../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ACCEPTED_FILE_TYPES = {
  'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp', '.svg'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc', '.docx'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'application/vnd.ms-excel': ['.xls', '.xlsx'],
  'text/plain': ['.txt'],
};

export const formatFileSize = (sizeInBytes: number) => {
  const sizeInKB = sizeInBytes / 1024;
  return sizeInKB >= 1024
    ? `${(sizeInKB / 1024).toFixed(2)} MB`
    : `${sizeInKB.toFixed(2)} KB`;
};

const UploadAssetModal = ({
  disabled = false,
  trigger,
}: {
  disabled?: boolean;
  trigger?: ReactElement;
}) => {
  const { teamId, storageId } = useParams<{
    teamId: Id<'teams'>;
    storageId: Id<'storages'>;
  }>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const createAssets = useMutation(api.assets.createAssets);

  const handleUploadAsset = async () => {
    if (files.length === 0) return;
    setIsLoading(true);

    try {
      //#1: Generate upload urls for each file
      const uploadUrls = await Promise.all(
        files.map(() => generateUploadUrl())
      );

      //#2: Transform files to contain metadata
      const fileUploads = files.map((file, index) => ({
        file,
        uploadUrl: uploadUrls[index],
        metadata: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        },
      }));

      //#3: Upload files
      const uploadedPromises = fileUploads.map(
        ({ file, uploadUrl, metadata }) =>
          fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': file.type },
            body: file,
          })
            .then(res => res.json())
            .then(result => ({
              ...metadata,
              fileId: result.storageId as Id<'_storage'>,
              storageId,
              teamId,
            }))
      );

      const results = await Promise.all(uploadedPromises);
      await createAssets({ teamId, assets: results });

      toast.success(`File${files.length > 1 ? 's' : ''} uploaded successfully`);
      setIsOpen(false);
      setFiles([]);
    } catch {
      toast.error(`Failed to upload file${files.length > 1 ? 's' : ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnDropRejected = () => {
    setIsDragOver(false);
    toast.error('File type is not supported', {
      description: 'Please choose images or documents.',
    });
  };

  const handleOnDropAccepted = (acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    setIsDragOver(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {trigger || (
          <button
            className={cn(
              'flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-muted',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            disabled={isLoading || disabled}
          >
            <CloudUpload className='size-4 mr-1.5' strokeWidth={1.5} />
            Upload asset
          </button>
        )}
      </DialogTrigger>
      <DialogContent className='p-0 border-0'>
        <Dropzone
          onDropRejected={handleOnDropRejected}
          onDropAccepted={handleOnDropAccepted}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
          accept={ACCEPTED_FILE_TYPES}
          maxSize={10 * 1024 * 1024}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className={`
                  border-2 border-dashed rounded-lg p-14 text-center cursor-pointer
                  ${isDragOver ? 'border-blue-700/30 dark:border-blue-700/65' : 'border-border'}
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
              <input {...getInputProps()} disabled={isLoading} />
              <>
                <CloudUpload
                  className='mx-auto mb-4 text-muted-foreground/80 size-12'
                  strokeWidth={1.5}
                />
                <p className='font-medium text-primary'>
                  {isDragOver
                    ? 'Drop files here'
                    : 'Drag and drop files here, or click to select'}
                </p>
                <div className='flex justify-center gap-4 mt-2 text-sm text-muted-foreground/80'>
                  <span className='flex items-center gap-1'>
                    <ImageIcon className='size-4' /> Images
                  </span>
                  <span className='flex items-center gap-1'>
                    <FileText className='size-4' /> Documents
                  </span>
                </div>
                <p className='text-xs text-muted-foreground/80 mt-2'>
                  Max file size: 10MB
                </p>
              </>
            </div>
          )}
        </Dropzone>
        {files.length > 0 && (
          <div className='p-4'>
            <h4 className='font-medium text-sm mb-2'>
              {files.length} selected files
            </h4>
            <ul className='overflow-y-auto max-h-32 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-muted scrollbar-track-transparent'>
              {files.map((file, index) => (
                <li key={index} className='flex items-center gap-2 text-sm'>
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className='text-muted-foreground size-4' />
                  ) : (
                    <FileText className='text-muted-foreground size-4' />
                  )}
                  {file.name} - {formatFileSize(file.size)}
                </li>
              ))}
            </ul>
            <DialogFooter className='mt-4'>
              <DialogClose asChild>
                <Button size='sm' variant='ghost' onClick={() => setFiles([])}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size='sm'
                onClick={handleUploadAsset}
                disabled={isLoading}
                className='min-w-24'
              >
                {isLoading ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  'Upload Files'
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadAssetModal;
