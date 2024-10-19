import type { ReactNode } from 'react';

import ProjectsLinks from './(components)/ProjectsLinks';
import InnerSidebar from '../(components)/InnerSidebar';
import { Id } from '../../../../../convex/_generated/dataModel';

const ProjectsLayout = ({
  children,
  params: { teamId },
}: {
  children: ReactNode;
  params: { teamId: Id<'teams'> };
}) => {
  return (
    <div className='flex'>
      <InnerSidebar title='Projects'>
        <ProjectsLinks teamId={teamId} />
      </InnerSidebar>
      <section className='p-4'>{children}</section>
    </div>
  );
};

export default ProjectsLayout;
