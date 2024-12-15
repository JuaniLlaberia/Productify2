import { type ReactElement } from 'react';

type SettingsHeaderProps = {
  title: string;
  icon: ReactElement;
};

const SettingsHeader = ({ title, icon }: SettingsHeaderProps) => {
  return (
    <nav className='flex h-12 items-center w-full p-2 px-4 border-b border-border'>
      <h2 className='flex items-center gap-2 text-sm font-medium'>
        <span>{icon}</span>
        {title}
      </h2>
    </nav>
  );
};

export default SettingsHeader;
