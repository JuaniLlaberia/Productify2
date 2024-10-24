import { List, Sheet } from 'lucide-react';

import ProjectsNavbar from '../(components)/Navbar';
import ReportsForm from './(components)/ReportsForm';

const FILTERS = [
  {
    label: 'Priority',
    field: 'priority',
    options: ['low', 'medium', 'high', 'urgent'],
  },
  {
    label: 'Label',
    field: 'type',
    options: ['ui/ux', 'functional', 'performance', 'security', 'other'],
  },
];

const ProjectBugReportsPage = () => {
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
        createButtonLabel='New report'
        createModal={<ReportsForm />}
      />
      <div>OUR reports</div>
    </section>
  );
};

export default ProjectBugReportsPage;
