'use client';

import { FileText } from 'lucide-react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import { api } from '../../../../../../../convex/_generated/api';
import { Id, Doc } from '../../../../../../../convex/_generated/dataModel';
import { EmojiPopover } from '@/components/ui/emoji-popover';
import { Button } from '@/components/ui/button';

type DocHeaderEditorProps = {
  document: Doc<'documents'>;
  cabinetId: Id<'cabinets'>;
  teamId: Id<'teams'>;
};

const DocHeaderEditor = ({
  document,
  cabinetId,
  teamId,
}: DocHeaderEditorProps) => {
  const editDocument = useMutation(api.documents.updateDocument);

  const handleUpdate = async (
    updateData: Partial<{
      title: string;
      icon: string;
      isArchived: boolean;
      private: boolean;
    }>
  ) => {
    try {
      await editDocument({
        documentId: document._id,
        teamId,
        cabinetId,
        documentData: {
          title: document.title,
          icon: document.icon,
          isArchived: document.isArchived,
          private: document.private,
          ...updateData,
        },
      });

      toast.success('Successfully updated document information');
    } catch {
      toast.error('Failed to update document information');
    }
  };

  return (
    <div className='flex items-center gap-1.5'>
      <EmojiPopover
        side='bottom'
        align='start'
        hint='Choose an icon'
        onEmojiSelect={emoji => handleUpdate({ icon: emoji.native })}
      >
        <Button
          size='icon'
          variant='ghost'
          className='hover:bg-accent/90 dark:hover:bg-accent/70 data-[state=open]:bg-accent/90 dark:data-[state=open]:bg-accent/70'
        >
          {document.icon ? (
            <span>{document.icon}</span>
          ) : (
            <FileText className='size-4' strokeWidth={1.5} />
          )}
        </Button>
      </EmojiPopover>

      <input
        className='h-8 p-1 px-1.5 outline-none bg-transparent text-sm font-medium rounded-md hover:bg-accent/70 dark:hover:bg-accent/50 focus:bg-accent/70 dark:focus:bg-accent/50'
        defaultValue={document.title}
        onBlur={e => handleUpdate({ title: e.target.value.trim() })}
      />
    </div>
  );
};

export default DocHeaderEditor;
