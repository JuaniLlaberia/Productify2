import type { ReactNode } from 'react';

import InnerSidebar from '../(components)/InnerSidebar';
import SettingsLinks from './(components)/SettingsLinks';
import { Id } from '../../../../../convex/_generated/dataModel';

const SettingsLayout = ({
  children,
  params: { teamId },
}: {
  children: ReactNode;
  params: { teamId: Id<'teams'> };
}) => {
  return (
    <div className='flex'>
      <InnerSidebar title='Settings'>
        <SettingsLinks teamId={teamId} />
      </InnerSidebar>
      <section className='p-4 w-full'>{children}</section>
    </div>
  );
};

export default SettingsLayout;
