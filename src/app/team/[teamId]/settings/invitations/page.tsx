import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

import SettingsHeader from '../(components)/SettingsHeader';
import InviteForm from './(components)/InviteForm';

const InviteSettingsPage = () => {
  return (
    <section>
      <SettingsHeader
        title='Invitations'
        icon={<EnvelopeClosedIcon className='size-4' strokeWidth={2} />}
      />
      <div className='p-4'>
        <InviteForm />
      </div>
    </section>
  );
};

export default InviteSettingsPage;
