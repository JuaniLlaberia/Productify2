'use client';

import Quill from 'quill';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';

const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => <Skeleton className='w-full h-32 mb-3' />,
});

type ChatInputProps = {
  placeholder: string;
  parentMessageId?: Id<'messages'>;
  channelId?: Id<'channels'>;
  conversationId?: Id<'conversations'>;
};

const ChatInput = ({
  placeholder,
  parentMessageId,
  channelId,
  conversationId,
}: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState<number>(0);
  const [isPending, setIsPending] = useState<boolean>(false);

  const editorRef = useRef<Quill | null>(null);

  const { teamId } = useParams<{
    teamId: Id<'teams'>;
  }>();

  const createMsg = useMutation(api.messages.createMessage);
  const getUploadUrl = useMutation(api.upload.generateUploadUrl);

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      //Image upload
      const message: {
        teamId: Id<'teams'>;
        channelId?: Id<'channels'>;
        conversationId?: Id<'conversations'>;
        message: string;
        image?: Id<'_storage'>;

        parentMessageId?: Id<'messages'>;
      } = {
        teamId,
        channelId,
        conversationId,
        message: body,
        parentMessageId,
      };

      if (image) {
        const uploadUrl = await getUploadUrl();
        if (!uploadUrl) throw new Error('Url not found');

        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image,
        });

        if (!response.ok) throw new Error('Failed to upload image');

        const { storageId } = await response.json();
        message.image = storageId;
      }

      await createMsg(message);

      setEditorKey(prev => prev + 1);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  return (
    <div className='px-5 w-full'>
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
