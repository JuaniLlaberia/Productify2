'use client';

import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';
import { usePanel } from '../(context)/PanelContext';

const Panel = () => {
  const { isOpen, content } = usePanel();

  if (!isOpen) return null;

  return (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30} minSize={25} maxSize={37.5}>
        {content}
      </ResizablePanel>
    </>
  );
};

export default Panel;
