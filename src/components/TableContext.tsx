'use client';

import { Table } from '@tanstack/react-table';
import { createContext, useContext, ReactNode, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface TableContextType {
  table: Table<any> | null;
  setTable: (table: Table<any>) => void;
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: (visibility: Record<string, boolean>) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: ReactNode }) {
  const [tableInstance, setTableInstance] = useState<Table<any> | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  return (
    <TableContext.Provider
      value={{
        table: tableInstance,
        setTable: setTableInstance,
        columnVisibility,
        setColumnVisibility,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
}

export function ColumnVisibilityDropdown() {
  const { table, columnVisibility, setColumnVisibility } = useTable();

  if (!table) return null;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon'>
              <SlidersHorizontal className='size-4' strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Customize view</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align='end'>
        {table
          .getAllColumns()
          .filter(column => column.getCanHide())
          .map(column => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={columnVisibility[column.id] !== false} // Default to true if undefined
                onCheckedChange={value => {
                  setColumnVisibility({
                    ...columnVisibility,
                    [column.id]: value,
                  });
                }}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
