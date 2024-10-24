import { List, Sheet } from 'lucide-react';

import ProjectsNavbar from '../(components)/Navbar';
import TemplatesForm from './(components)/TemplatesForm';

const FILTERS = [
  {
    label: 'Priority',
    field: 'priority',
    options: ['low', 'medium', 'high', 'urgent'],
  },
  {
    label: 'Status',
    field: 'status',
    options: ['backlog', 'todo', 'in-progress', 'completed', 'canceled'],
  },
  {
    label: 'Label',
    field: 'label',
    options: ['Test', 'Test', 'Test'],
  },
];

const ProjectTemplatesPage = () => {
  return (
    <section className='w-full'>
      <ProjectsNavbar
        filters={FILTERS}
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
        createButtonLabel='New template'
        createModal={<TemplatesForm />}
      />
      <div>OUR TEMPLATES</div>
    </section>
  );
};

export default ProjectTemplatesPage;
