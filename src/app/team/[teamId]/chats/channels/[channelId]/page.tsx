import Channel from '../(components)/Channel';
import { Id } from '../../../../../../../convex/_generated/dataModel';

const ChannelPage = ({
  params: { teamId, channelId },
}: {
  params: {
    teamId: Id<'teams'>;
    channelId: Id<'channels'>;
  };
}) => {
  return <Channel key={channelId} teamId={teamId} channelId={channelId} />;
};

export default ChannelPage;
