import Conversation from '../(components)/Conversation';
import { Id } from '../../../../../../../convex/_generated/dataModel';

const ConversationPage = ({
  params: { teamId, conversationId },
}: {
  params: {
    teamId: Id<'teams'>;
    conversationId: Id<'conversations'>;
  };
}) => {
  return (
    <Conversation
      key={conversationId}
      teamId={teamId}
      conversationId={conversationId}
    />
  );
};

export default ConversationPage;
