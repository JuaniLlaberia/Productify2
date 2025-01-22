import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { Folder, Plus } from 'lucide-react';
import { toast } from 'sonner';

import DocumentsList from './DocumentsList';
import SidebarLoader from '../../(components)/SidebarLoader';
import SidebarExpandItemV2 from '../../(components)/SidebarExpandItemV2';
import CabinetActions from './CabinetActions';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';

const CabinetsList = () => {
  const { teamId } = useParams<{
    teamId: Id<'teams'>;
  }>();
  const router = useRouter();

  const cabinets = useQuery(api.cabinets.getCabinets, { teamId });
  const createDocument = useMutation(api.documents.createDocument);

  if (!cabinets) return <SidebarLoader />;

  const handleCreateDoc = async (cabinetId: Id<'cabinets'>) => {
    const promise = createDocument({
      teamId,
      documentData: {
        title: 'Untitled',
        private: true,
        isArchived: false,
        cabinetId,
      },
    }).then(docId => {
      router.push(`/team/${teamId}/documents/${docId}`);
    });

    toast.promise(promise, {
      loading: 'Creating new document',
      success: 'Document created successfully',
      error: 'Failed to create document',
    });
  };

  return (
    <ul>
      {cabinets.map(cabinet => {
        const { _id, name, icon } = cabinet;

        return (
          <SidebarExpandItemV2
            key={_id}
            id={_id}
            title={name}
            icon={icon ? icon : <Folder className='size-4' strokeWidth={1.5} />}
            links={<DocumentsList teamId={teamId} level={0} cabinetId={_id} />}
            trigger={
              <Button
                size='icon-sm'
                variant='ghost'
                onClick={() => handleCreateDoc(_id)}
              >
                <Plus className='size-4' strokeWidth={1.5} />
              </Button>
            }
            options={<CabinetActions data={cabinet} />}
          />
        );
      })}
    </ul>
  );
};

export default CabinetsList;
