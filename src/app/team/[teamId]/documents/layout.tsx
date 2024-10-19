import type { ReactNode } from 'react';

import InnerSidebar from '../(components)/InnerSidebar';
import DocumentsLinks from './(components)/DocumentsLinks';
import { Id } from '../../../../../convex/_generated/dataModel';

const DocumentsLayout = ({
  children,
  params: { teamId },
}: {
  children: ReactNode;
  params: { teamId: Id<'teams'> };
}) => {
  return (
    <div className='flex'>
      <InnerSidebar title='Documents'>
        <DocumentsLinks />
      </InnerSidebar>
      <section className='p-4 w-full'>{children}</section>
    </div>
  );
};

export default DocumentsLayout;
