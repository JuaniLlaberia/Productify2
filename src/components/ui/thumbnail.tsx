import { X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type ThumbnailProps = {
  url: string | null | undefined;
};

const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className='relative overflow-hidden max-w-[360px] border rounded-lg cursor-zoom-in'>
          <img
            src={url}
            alt='Message image'
            className='rounded-md object-cover size-full'
          />
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-[800px] border-none bg-transparent p-0 shadow-none'>
        <img
          src={url}
          alt='Message image'
          className='rounded-md object-cover size-full'
        />
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
