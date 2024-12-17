'use client';

import { Download, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import DeleteAssetsModal from './DeleteAssetsModal';
import AssetForm from './AssetForm';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Doc } from '../../../../../../../convex/_generated/dataModel';

const AssetsActions = ({
  data,
}: {
  data: Doc<'assets'> & {
    fileUrl?: string;
    createdBy: Doc<'users'>;
  };
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='size-6 p-0 hover:bg-muted'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal
            className='size-4 text-muted-foreground'
            strokeWidth={1.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <DropdownMenuItem
          onSelect={e => e.preventDefault()}
          onClick={() => {
            window.open(data.fileUrl, '_blank');
          }}
        >
          <Download className='size-3.5 mr-2' strokeWidth={1.5} />
          Download asset
        </DropdownMenuItem>
        <AssetForm
          assetId={data._id}
          assetName={data.name}
          onClose={() => setIsDropdownOpen(false)}
          trigger={
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Edit className='size-3.5 mr-2' strokeWidth={1.5} />
              Edit asset
            </DropdownMenuItem>
          }
        />
        <DropdownMenuSeparator />
        <DeleteAssetsModal
          teamId={data.teamId}
          assets={[{ assetId: data._id, fileIdInStorage: data.fileId }]}
          trigger={
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Trash2 className='size-3.5 mr-2' strokeWidth={1.5} />
              Delete asset
            </DropdownMenuItem>
          }
          onSuccess={() => setIsDropdownOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AssetsActions;
