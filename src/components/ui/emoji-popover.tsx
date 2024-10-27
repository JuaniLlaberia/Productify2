'use client';

import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useState, type ReactNode } from 'react';
import { useTheme } from 'next-themes';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type EmojiPopoverProps = {
  children: ReactNode;
  align?: 'center' | 'end' | 'start';
  side?: 'top' | 'right' | 'bottom' | 'left';
  searchbar?: boolean;
  hint?: string;
  onEmojiSelect: (emoji: any) => void;
};

export const EmojiPopover = ({
  children,
  hint = 'Emoji',
  align = 'end',
  side,
  searchbar = false,
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const { theme } = useTheme();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>{hint}</TooltipContent>
      </Tooltip>
      <PopoverContent
        align={align}
        side={side}
        className='p-0 w-full border-none shadow-none bg-transparent'
      >
        <Picker
          data={data}
          onEmojiSelect={onEmojiSelect}
          searchPosition={searchbar ? 'top' : 'none'}
          previewPosition='none'
          skinTonePosition='none'
          noCountryFlags={true}
          categories={[
            'people',
            'activity',
            'foods',
            'nature',
            'objects',
            'places',
            'symbols',
          ]}
          maxFrequentRows='0'
          lazyLoad={true}
          theme={theme === 'light' ? 'light' : 'dark'}
          emojiButtonRadius='0.5rem'
          set='native'
        />
      </PopoverContent>
    </Popover>
  );
};
