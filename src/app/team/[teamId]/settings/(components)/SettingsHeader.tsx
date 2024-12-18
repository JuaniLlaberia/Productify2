import { type ReactElement } from 'react';
import Header from '@/components/Header';

type SettingsHeaderProps = {
  title: string;
  icon: ReactElement;
};

const SettingsHeader = ({ title, icon }: SettingsHeaderProps) => {
  return (
    <Header
      leftContent={
        <h2 className='flex items-center gap-2 text-sm font-medium'>
          <span>{icon}</span>
          {title}
        </h2>
      }
    />
  );
};

export default SettingsHeader;
