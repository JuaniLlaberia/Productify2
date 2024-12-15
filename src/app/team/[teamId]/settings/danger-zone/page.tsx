import { AlertTriangle } from 'lucide-react';

import SettingsHeader from '../(components)/SettingsHeader';
import LeaveTeamModal from './(components)/LeaveTeamModal';
import DeleteTeamModal from './(components)/DeleteTeamModal';

const DangerZoneSettingsPage = () => {
  return (
    <section>
      <SettingsHeader
        title='Danger settings'
        icon={<AlertTriangle className='size-4' strokeWidth={2} />}
      />
      <div className='p-4 space-y-2.5'>
        <LeaveTeamModal />
        <DeleteTeamModal teamName='Team' />
      </div>
    </section>
  );
};

export default DangerZoneSettingsPage;
