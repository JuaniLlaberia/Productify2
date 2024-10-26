import type { ReactNode } from 'react';
import ProjectNavbar from './(components)/ProjectNavbar';

const ProjectsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full'>
      <ProjectNavbar />
      {children}
    </div>
  );
};

export default ProjectsLayout;
