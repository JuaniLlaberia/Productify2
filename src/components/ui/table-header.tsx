import { ArrowUpDown } from 'lucide-react';
import type { ReactElement } from 'react';

import { Button } from './button';
import { Column } from '@tanstack/react-table';

type TableHeaderProps = {
  label: string;
  icon: ReactElement;
  column: Column<any>;
};

const CustomTableHeader = ({ icon, label, column }: TableHeaderProps) => {
  return (
    <div className='flex items-center px-2 group'>
      {icon}
      <p className='text-xs capitalize'>{label}</p>
      <Button
        size='icon'
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='size-5 bg-primary-foreground/50 hover:bg-primary-foreground ml-2 p-1 opacity-0 group-hover:opacity-100 cursor-pointer'
      >
        <ArrowUpDown className='size-3' />
      </Button>
    </div>
  );
};

export default CustomTableHeader;
