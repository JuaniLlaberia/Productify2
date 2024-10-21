import type { ReactNode } from 'react';

import InnerSidebar from '../(components)/InnerSidebar';
import ChannelsLinks from './(components)/ChannelsLinks';

const ChannelsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex'>
      <InnerSidebar title='Channels'>
        <ChannelsLinks />
      </InnerSidebar>
      <section className='p-4'>{children}</section>
    </div>
  );
};

export default ChannelsLayout;
