'use client';

import Link from 'next/link';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { ReactElement, MouseEvent } from 'react';

import Hint from '@/components/ui/hint';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '../../../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';

type DocumentItemProps = {
  id?: Id<'documents'>;
  cabinetId: Id<'cabinets'>;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  level?: number;
  label: string;
  icon: string | ReactElement;
  onExpand?: () => void;
};

const DocumentItem = ({
  id,
  cabinetId,
  label,
  icon,
  active,
  documentIcon,
  level = 0,
  onExpand,
  expanded,
}: DocumentItemProps) => {
  const router = useRouter();
  const createDocument = useMutation(api.documents.createDocument);
  const deleteDocument = useMutation(api.documents.deleteDocument);
  const { teamId } = useParams<{
    teamId: Id<'teams'>;
  }>();

  const handleExpand = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onCreate = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!id) return;

    const promise = createDocument({
      teamId,
      documentData: {
        title: 'Untitled',
        parentDocument: id,
        private: true,
        isArchived: false,
        cabinetId,
      },
    }).then(docId => {
      if (!expanded) {
        onExpand?.();
      }

      router.push(`/team/${teamId}/documents/${docId}`);
    });

    toast.promise(promise, {
      loading: 'Creating new document',
      success: 'Document created successfully',
      error: 'Failed to create document',
    });
  };

  const onDelete = (
    event: MouseEvent<HTMLButtonElement>,
    documentId: Id<'documents'>
  ) => {
    event.stopPropagation();

    if (!id) return;

    const promise = deleteDocument({
      documentId,
      teamId,
    }).then(() => {
      router.push(`/team/${teamId}/documents`);
    });

    toast.promise(promise, {
      loading: 'Deleting document and related ones',
      success: 'Document deleted successfully',
      error: 'Failed to delete document',
    });
  };

  const ChevronIcon = expanded ? (
    <ChevronDown className='size-4 shrink-0 text-muted-foreground' />
  ) : (
    <ChevronRight className='size-4 shrink-0 text-muted-foreground' />
  );

  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
      className={cn(
        'group w-full flex items-center gap-2 px-2 py-1.5 mb-0.5 rounded-lg text-sm hover:bg-primary/5 dark:hover:bg-muted/60',
        active ? 'bg-primary/5 dark:bg-muted/60' : null
      )}
    >
      <div role='button' className='h-full rounded-sm' onClick={handleExpand}>
        {ChevronIcon}
      </div>
      {documentIcon ? <div>{documentIcon}</div> : icon}
      <Link href={`/team/${teamId}/documents/${id}`} className='flex-1'>
        <p>{label}</p>
      </Link>
      {!!id && (
        <div className='flex items-center gap-x-2'>
          <Hint label='Add document'>
            <Button
              onClick={onCreate}
              size='icon-sm'
              variant='ghost'
              className='opacity-0 group-hover:opacity-100'
            >
              <Plus className='size-4 text-muted-foreground' />
            </Button>
          </Hint>
          <Hint label='Delete document'>
            <Button
              onClick={e => onDelete(e, id)}
              size='icon-sm'
              variant='ghost'
              className='opacity-0 group-hover:opacity-100'
            >
              <Trash2
                className='size-4 text-muted-foreground'
                strokeWidth={1.5}
              />
            </Button>
          </Hint>
        </div>
      )}
    </div>
  );
};

export default DocumentItem;

DocumentItem.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : '12px' }}
      className='flex gap-x-2 py-[3px]'
    >
      <Skeleton className='size-4' />
      <Skeleton className='h-4 w-[85%]' />
    </div>
  );
};
