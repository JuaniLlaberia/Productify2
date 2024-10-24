import type { ReactNode } from 'react';

import ProjectsLinks from './(components)/ProjectsLinks';
import InnerSidebar from '../(components)/InnerSidebar';

const ProjectsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex'>
      <InnerSidebar title='Projects'>
        <ProjectsLinks />
      </InnerSidebar>
      {children}
    </div>
  );
};

export default ProjectsLayout;
