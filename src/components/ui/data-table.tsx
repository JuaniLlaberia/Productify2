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
import { type ComponentType, useEffect, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTable } from '../TableContext';
import { Button } from './button';
import { Id } from '../../../convex/_generated/dataModel';
import { Skeleton } from './skeleton';

interface DeletableItem {
  _id: Id<any>;
  teamId: Id<'teams'>;
}

interface DeleteModalProps {
  teamId: Id<'teams'>;
  ids: Id<any>[];
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

interface DataTableProps<TData extends DeletableItem, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  paginationOpts: {
    loadMore: () => void;
    canLoadMore: boolean;
    isLoadingMore: boolean;
  };
  DeleteModal?: ComponentType<DeleteModalProps>;
}

export function DataTable<TData extends DeletableItem, TValue>({
  columns,
  data,
  isLoading,
  paginationOpts,
  DeleteModal,
}: DataTableProps<TData, TValue>) {
  const { setTable, columnVisibility } = useTable();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnSizing, setColumnSizing] = useState({});

  const { loadMore, canLoadMore, isLoadingMore } = paginationOpts;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    // Enable column resizing
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onColumnSizingChange: setColumnSizing,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnFilters,
      columnSizing,
    },
  });

  useEffect(() => {
    setTable(table);
  }, [table, setTable]);

  return (
    <div className='relative'>
      <div className='overflow-auto'>
        <Table className='relative w-full'>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        position: 'relative',
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-border opacity-0 hover:opacity-100 ${
                            header.column.getIsResizing()
                              ? 'bg-primary opacity-100'
                              : ''
                          }`}
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading &&
              [1, 2, 3, 4, 5].map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, columnIndex) => (
                    <TableCell key={columnIndex}>
                      <Skeleton className='w-full h-5' />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : !isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center text-muted-foreground'
                    >
                      No results
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <footer className='flex items-center justify-between p-1'>
        <div>
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <p className='flex-1 text-sm text-muted-foreground p-1'>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </p>
          ) : null}
        </div>
        <div className='m-1'>
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            DeleteModal && (
              <DeleteModal
                teamId={table.getSelectedRowModel().rows[0].original.teamId}
                ids={table
                  .getSelectedRowModel()
                  .rows.map(row => row.original._id)}
                onSuccess={() => setRowSelection({})}
              />
            )
          ) : (
            <div className='flex items-center justify-end space-x-2'>
              <Button
                variant='ghost'
                size='sm'
                className='min-w-24'
                onClick={loadMore}
                disabled={!canLoadMore || isLoadingMore || isLoading}
              >
                {isLoadingMore ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  <span className='flex items-center'>
                    Load more
                    <Plus className='ml-1.5 size-4' strokeWidth={2} />
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
