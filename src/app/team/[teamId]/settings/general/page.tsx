import { Settings } from 'lucide-react';

import SettingsHeader from '../(components)/SettingsHeader';
import TeamForm from './(components)/TeamForm';

const GeneralSettingsPage = () => {
  return (
    <section>
      <SettingsHeader
        title='General'
        icon={<Settings className='size-4' strokeWidth={2} />}
      />
      <div className='p-4 px-6'>
        <TeamForm />
      </div>
    </section>
  );
};

export default GeneralSettingsPage;
