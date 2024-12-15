import type { ReactNode } from 'react';
import ProjectHeader from './(components)/ProjectHeader';

const ProjectsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full'>
      <ProjectHeader />
      {children}
    </div>
  );
};

export default ProjectsLayout;
