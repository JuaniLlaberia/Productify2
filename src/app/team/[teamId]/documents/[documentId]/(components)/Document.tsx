'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';

import Header from '@/components/Header';
import DocHeaderEditor from './DocHeaderEditor';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';
import { Skeleton } from '@/components/ui/skeleton';

type DocumentProps = {
  documentId: Id<'documents'>;
};

const Document = ({ documentId }: DocumentProps) => {
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const document = useQuery(api.documents.getDocument, { teamId, documentId });

  return (
    <div>
      <Header
        leftContent={
          !document ? (
            <Skeleton className='w-40 h-8' />
          ) : (
            <DocHeaderEditor
              document={document}
              cabinetId={document.cabinetId}
              teamId={teamId}
            />
          )
        }
      />
    </div>
  );
};

export default Document;
