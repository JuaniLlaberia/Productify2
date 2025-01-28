'use client';

import { Download, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { PopulatedAssets } from './assetsColumns';

const AssetsActions = ({ data }: { data: PopulatedAssets }) => {
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
            if (data.fileUrl) {
              window.open(data.fileUrl, '_blank');
            } else {
              toast.error('Failed to load file URL');
            }
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
          ids={[data._id]}
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
