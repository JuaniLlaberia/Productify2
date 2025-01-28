'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { FileText } from 'lucide-react';

import DocumentItem from './DocumentItem';
import SidebarLoader from '../../(components)/SidebarLoader';
import { Doc, Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';
import { cn } from '@/lib/utils';

type DocumentsLinksProps = {
  teamId: Id<'teams'>;
  cabinetId: Id<'cabinets'>;
  parentDocument?: Id<'documents'>;
  data?: Doc<'documents'>[];
  level?: number;
};

const DocumentsList = ({
  teamId,
  cabinetId,
  parentDocument,
  level = 0,
}: DocumentsLinksProps) => {
  const params = useParams();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const documents = useQuery(api.documents.getDocuments, {
    teamId,
    cabinetId,
    parentDocument,
  });

  if (!documents)
    return (
      <>
        {level === 0 ? (
          <SidebarLoader />
        ) : (
          <DocumentItem.Skeleton level={level} />
        )}
      </>
    );

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          'hidden text-sm text-muted-foreground mt-1.5 mb-2 mx-1',
          expanded ? 'last:block' : null,
          level === 0 ? 'hidden' : null
        )}
      >
        No documents inside
      </p>
      {documents.map(doc => (
        <div key={doc._id} className='mb-0.5'>
          <DocumentItem
            id={doc._id}
            cabinetId={cabinetId}
            label={doc.title as string}
            icon={
              <FileText
                className='size-4 text-muted-foreground'
                strokeWidth={1.5}
              />
            }
            documentIcon={doc.icon}
            active={params.documentId === doc._id}
            level={level}
            onExpand={() => onExpand(doc._id)}
            expanded={expanded[doc._id]}
          />

          {expanded[doc._id] && (
            <DocumentsList
              parentDocument={doc._id}
              cabinetId={cabinetId}
              teamId={teamId}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentsList;
