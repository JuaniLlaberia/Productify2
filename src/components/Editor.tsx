'use client';

import Image from 'next/image';
import Quill, { type QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import {
  type MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { CaseSensitive, ImageIcon, Send, Smile, X } from 'lucide-react';
import 'quill/dist/quill.snow.css';

import { cn } from '@/lib/utils';
import Hint from './ui/hint';
import { Button } from './ui/button';
import { EmojiPopover } from './ui/emoji-popover';

type EditorValue = {
  image: File | null;
  body: string;
};

type EditorProps = {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: 'create' | 'update';
};

const Editor = ({
  onSubmit,
  onCancel,
  placeholder = 'Write something...',
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = 'create',
}: EditorProps) => {
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);

  //This approach is to avoid unneccesary re-renders inside the useEffect and avoid dependencies
  const submtitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submtitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div')
    );

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, '').trim().length === 0;
                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                submtitRef.current?.({ body, image: addedImage });
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              hanlder: () => {
                quill?.insertText(quill.getSelection()?.index || 0, '\n');
              },
            },
          },
        },
        toolbar: [
          ['bold', 'italic', 'underline'],
          ['link', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    //So we can control it from the outer component
    if (innerRef) innerRef.current = quill;

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) container.innerHTML = '';
      if (quillRef.current) quillRef.current = null;
      if (innerRef) innerRef.current = null;
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible(prev => !prev);
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

    if (toolbarElement) toolbarElement?.classList.toggle('hidden');
  };

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;

    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  return (
    <div className='flex flex-col mb-3'>
      <input
        type='file'
        accept='image/*'
        ref={imageElementRef}
        onChange={e => setImage(e.target.files![0])}
        className='hidden'
      />
      <div
        className={cn(
          'flex flex-col border border-border rounded-lg overflow-hidden focus-within:border-slate-300/20 focus-within:shadow-sm transition',
          disabled ? 'opacity-60' : null
        )}
      >
        <div ref={containerRef} className='h-full ql-custom' />
        {!!image ? (
          <div className='p-2'>
            <div className='relative size-[62px] flex items-center justify-center group/image'>
              <Hint label='Remove image'>
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = '';
                  }}
                  className='hidden group-hover/image:flex rounded-full bg-accent absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-border items-center justify-center'
                >
                  <X className='size-3.5' />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt='uploaded'
                fill
                className='rounded-lg overflow-hidden object-cover'
              />
            </div>
          </div>
        ) : null}
        <div className='flex px-2 pb-2 z-[5]'>
          <Hint
            label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}
          >
            <Button
              className='text-muted-foreground'
              disabled={disabled}
              variant='ghost'
              size='icon'
              onClick={toggleToolbar}
            >
              <CaseSensitive className='size-4' />
            </Button>
          </Hint>
          <EmojiPopover
            align='start'
            onEmojiSelect={onEmojiSelect}
            closeAfterSelection={false}
          >
            <Button
              className='text-muted-foreground'
              disabled={disabled}
              variant='ghost'
              size='icon'
            >
              <Smile className='size-4' />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label='Image'>
              <Button
                className='text-muted-foreground'
                disabled={disabled}
                variant='ghost'
                size='icon'
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className='size-4' />
              </Button>
            </Hint>
          )}
          {variant === 'create' ? (
            <Button
              variant='ghost'
              className={cn(
                'ml-auto',
                isEmpty
                  ? null
                  : 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
              )}
              size='icon'
              disabled={isEmpty || disabled}
              onClick={() =>
                onSubmit({
                  image,
                  body: JSON.stringify(quillRef.current?.getContents()),
                })
              }
            >
              <Send className='size-4' strokeWidth={1.5} />
            </Button>
          ) : (
            <div className='ml-auto flex items-center gap-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                size='sm'
                onClick={() =>
                  onSubmit({
                    image,
                    body: JSON.stringify(quillRef.current?.getContents()),
                  })
                }
                disabled={disabled || isEmpty}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
      {variant === 'create' ? (
        <div
          className={cn(
            'mt-1 px-2 text-[10px] text-muted-foreground flex justify-end opacity-0',
            !isEmpty && 'opacity-100'
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Editor;
