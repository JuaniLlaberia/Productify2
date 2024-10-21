import type { ReactNode } from 'react';

import InnerSidebar from '../(components)/InnerSidebar';
import AssetsLinks from './(components)/AssetsLinks';

const AssetsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex'>
      <InnerSidebar title='Assets'>
        <AssetsLinks />
      </InnerSidebar>
      <section className='p-4'>{children}</section>
    </div>
  );
};

export default AssetsLayout;
