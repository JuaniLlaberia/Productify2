import type { ReactNode } from 'react';

type InnerSidebarProps = {
  title: string;
  children: ReactNode;
};

const InnerSidebar = ({ title, children }: InnerSidebarProps) => {
  return (
    <aside className='bg-muted/25 border-r border-border w-[250px] min-w-[250px] max-w-[250px] h-screen p-4 py-5'>
      <h2 className='text-lg font-semibold'>{title}</h2>
      <div className='py-2 mt-4'>{children}</div>
    </aside>
  );
};

export default InnerSidebar;
