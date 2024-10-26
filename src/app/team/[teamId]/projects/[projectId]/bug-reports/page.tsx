'use client';

import { List, Plus, Sheet } from 'lucide-react';
import { useQuery } from 'convex/react';
import DeleteReportsModal from './(components)/DeleteReportsModal';

import ProjectFeatureNavbar from '../(components)/ProjectFeatureNavbar';
import ReportsForm from './(components)/ReportsForm';
import { TableProvider } from '@/components/TableContext';
import { PriorityEnum, ReportTypeEnum } from '@/lib/enums';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';
import { DataTable } from '@/components/ui/data-table';
import { reportsColumns } from './(components)/reportsColumns';
import { Button } from '@/components/ui/button';

const FILTERS = [
  {
    label: 'Priority',
    field: 'priority',
    options: ['low', 'medium', 'high', 'urgent'],
  },
  {
    label: 'Type',
    field: 'type',
    options: ['ui/ux', 'functional', 'performance', 'security', 'other'],
  },
];

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

const ProjectBugReportsPage = ({
  params: { teamId, projectId },
  searchParams: { priority, type },
}: {
  params: {
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  };
  searchParams: {
    priority: PriorityEnum;
    type: ReportTypeEnum;
    view: 'board' | 'table';
  };
}) => {
  const reports = useQuery(api.reports.getProjectReports, {
    teamId,
    projectId,
    filters: { priority, type },
  });

  if (!reports) return <p>Loading</p>;

  return (
    <TableProvider>
      <section className='w-full'>
        <ProjectFeatureNavbar
          filters={FILTERS}
          views={VIEWS}
          defaultView='table'
          createButtonLabel='New report'
          createModal={<ReportsForm />}
        />
        <DataTable
          columns={reportsColumns}
          data={reports}
          DeleteModal={DeleteReportsModal}
          footerModal={<ReportsForm />}
          footerModalTrigger={
            <Button size='sm' variant='ghost' className='text-muted-foreground'>
              <Plus className='size-4 mr-1.5' strokeWidth={2} />
              Add report
            </Button>
          }
        />
      </section>
    </TableProvider>
  );
};

export default ProjectBugReportsPage;
