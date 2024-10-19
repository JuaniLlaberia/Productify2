'use client';

import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { ReactElement, MouseEvent } from 'react';

import { Id } from '../../../../../../convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '../../../../../../convex/_generated/api';

type DocumentItemProps = {
  id?: Id<'documents'>;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick: () => void;
  icon: ReactElement;
};

const DocumentItem = ({
  id,
  label,
  onClick,
  icon,
  active,
  documentIcon,
  level = 0,
  onExpand,
  expanded,
}: DocumentItemProps) => {
  const router = useRouter();
  const createDocument = useMutation(api.documents.createDocument);
  const { teamId } = useParams();

  const handleExpand = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onCreate = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (!id) return;

    const promise = createDocument({
      title: 'Untitled',
      parentDocument: id,
      teamId: teamId as Id<'teams'>,
    }).then(docId => {
      if (!expanded) {
        onExpand?.();
      }

      router.push(`documents/${docId}`);
    });

    toast.promise(promise, {
      loading: 'Creating new document',
      success: 'Document created successfully',
      error: 'Failed to create document',
    });
  };

  const ChevronIcon = expanded ? (
    <ChevronDown className='size-4 shrink-0 text-muted-foreground' />
  ) : (
    <ChevronRight className='size-4 shrink-0 text-muted-foreground' />
  );

  return (
    <div
      onClick={onClick}
      role='button'
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
      className={cn(
        'group flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-200',
        active ? 'bg-gray-200 text-primary' : null
      )}
    >
      {!!id ? (
        <div role='button' className='h-full rounded-sm' onClick={handleExpand}>
          {ChevronIcon}
        </div>
      ) : null}
      {documentIcon ? <div>{documentIcon}</div> : icon}
      <p>{label}</p>
      {!!id ? (
        <div className='ml-auto flex items-center gap-x-2'>
          <div
            role='button'
            onClick={onCreate}
            className='opacity-0 group-hover:opacity-100 h-full rounded-sm ml-auto hover:bg-white'
          >
            <Plus className='size-4 text-muted-foreground' />
          </div>
        </div>
      ) : null}
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
