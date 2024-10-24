import { Columns3, List, Sheet } from 'lucide-react';
import ProjectsNavbar from '../[projectId]/(components)/Navbar';

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

const AllTasksPage = () => {
  return (
    <section className='w-full'>
      <ProjectsNavbar
        filters={FILTERS}
        views={[
          {
            id: 'board',
            label: 'Board',
            icon: <Columns3 className='size-4' strokeWidth={1.5} />,
            value: 'board',
          },
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
        defaultView='board'
      />
      <div>ALL TASKS</div>
    </section>
  );
};

export default AllTasksPage;
