import ChannelsList from './(components)/ChannelsList';
import { Id } from '../../../../../../convex/_generated/dataModel';

const ChannelsPage = ({
  params: { teamId },
}: {
  params: { teamId: Id<'teams'> };
}) => {
  return (
    <section className='w-full h-screen flex flex-col'>
      <ChannelsList teamId={teamId} />
    </section>
  );
};

export default ChannelsPage;
