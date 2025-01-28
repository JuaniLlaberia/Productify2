'use client';

import { useTheme } from 'next-themes';
import { PaintRoller } from 'lucide-react';

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <PaintRoller className='size-4 mr-2' strokeWidth={1.5} />
        Themes
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className='flex flex-col gap-1 ml-2'>
        <DropdownMenuItem
          className={cn(theme === 'light' && 'bg-accent')}
          onClick={() => setTheme('light')}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(theme === 'dark' && 'bg-accent')}
          onClick={() => setTheme('dark')}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(theme === 'system' && 'bg-accent')}
          onClick={() => setTheme('system')}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export default ThemeButton;
