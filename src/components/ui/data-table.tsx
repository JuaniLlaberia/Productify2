'use client';

import {
  ColumnDef,
  SortingState,
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { ComponentType, type ReactNode, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTable } from '../TableContext';
import { Dialog, DialogContent, DialogTrigger } from './dialog';
import { Button } from './button';
import { Id } from '../../../convex/_generated/dataModel';

interface DeletableItem {
  _id: Id<any>;
  teamId: Id<'teams'>;
}

interface DeleteModalProps {
  teamId: Id<'teams'>;
  ids: Id<any>[];
  onSuccess: () => void;
}

interface DataTableProps<TData extends DeletableItem, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  DeleteModal: ComponentType<DeleteModalProps>;
  footerModal?: ReactNode;
  footerModalTrigger?: ReactNode;
}

export function DataTable<TData extends DeletableItem, TValue>({
  columns,
  data,
  DeleteModal,
  footerModal,
  footerModalTrigger,
}: DataTableProps<TData, TValue>) {
  const { setTable, columnVisibility } = useTable();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnFilters,
    },
  });

  useEffect(() => {
    setTable(table);
  }, [table, setTable]);

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-24 text-center text-muted-foreground'
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <footer className='flex items-center justify-between p-1'>
        <div>
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <p className='flex-1 text-sm text-muted-foreground p-1'>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </p>
          ) : footerModal ? (
            <Dialog>
              <DialogTrigger asChild>{footerModalTrigger}</DialogTrigger>
              <DialogContent>{footerModal}</DialogContent>
            </Dialog>
          ) : null}
        </div>
        <div className='m-1'>
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <Dialog>
              <DialogTrigger>
                <Button variant='destructive' size='sm'>
                  Delete all
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DeleteModal
                  teamId={table.getSelectedRowModel().rows[0].original.teamId}
                  ids={table
                    .getSelectedRowModel()
                    .rows.map(row => row.original._id)}
                  onSuccess={() => setRowSelection({})}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <div className='flex items-center justify-end space-x-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className='text-muted-foreground'
              >
                <ChevronLeft className='mr-1.5 size-4' strokeWidth={1.5} />
                Previous
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className='text-muted-foreground'
              >
                Next
                <ChevronRight className='ml-1.5 size-4' strokeWidth={1.5} />
              </Button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
