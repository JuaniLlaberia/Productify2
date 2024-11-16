import type { ReactNode } from 'react';

import InnerSidebar from '../(components)/InnerSidebar';
import ChannelsLinks from './(components)/ChannelsLinks';

const ChannelsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex'>
      <InnerSidebar title='Channels'>
        <ChannelsLinks />
      </InnerSidebar>
      {children}
    </div>
  );
};

export default ChannelsLayout;
