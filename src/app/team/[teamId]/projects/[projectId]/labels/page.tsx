import { List, Sheet } from 'lucide-react';

import ProjectsNavbar from '../(components)/Navbar';
import LabelsForm from './(components)/LabelsForm';

const ProjectLabelsPage = () => {
  return (
    <section className='w-full'>
      <ProjectsNavbar
        views={[
          {
            id: 'table',
            label: 'Table',
            icon: <Sheet className='size-4' strokeWidth={1.5} />,
            value: 'table',
          },
          {
            id: 'list',
            label: 'List',
            icon: <List className='size-4' strokeWidth={1.5} />,
            value: 'list',
          },
        ]}
        defaultView='table'
        createButtonLabel='New label'
        createModal={<LabelsForm />}
      />
      <div>OUR LABELS</div>
    </section>
  );
};

export default ProjectLabelsPage;
