import Document from './(components)/Document';
import { Id } from '../../../../../../convex/_generated/dataModel';

const DocumentPange = ({
  params: { documentId },
}: {
  params: { documentId: Id<'documents'> };
}) => {
  return (
    <section>
      <Document documentId={documentId} />
    </section>
  );
};

export default DocumentPange;
