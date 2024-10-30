'use client';

import { List, Sheet } from 'lucide-react';
import { useQuery } from 'convex/react';

import DeleteLabelsModal from './(components)/DeleteLabelsModal';
import ProjectFeatureNavbar from '../(components)/ProjectFeatureNavbar';
import LabelsForm from './(components)/LabelsForm';
import { TableProvider } from '@/components/TableContext';
import { DataTable } from '@/components/ui/data-table';
import { labelsColumns } from './(components)/labelsColumns';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';

const VIEWS = [
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
];

const ProjectLabelsPage = ({
  params: { teamId, projectId },
}: {
  params: {
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  };
}) => {
  const labels = useQuery(api.labels.getLabels, { teamId, projectId });
  if (!labels) return <p>Loading</p>;

  return (
    <TableProvider>
      <section className='w-full'>
        <ProjectFeatureNavbar
          views={VIEWS}
          defaultView='table'
          createButtonLabel='New label'
          createModal={<LabelsForm />}
        />
        <DataTable
          columns={labelsColumns}
          data={labels}
          DeleteModal={DeleteLabelsModal}
        />
      </section>
    </TableProvider>
  );
};

export default ProjectLabelsPage;
