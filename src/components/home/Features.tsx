import { Bug, CheckSquare, HardDrive, MessagesSquare } from 'lucide-react';

import { BentoCard, BentoGrid } from '../bento-grid';
import { FilesMarquee } from './FilesMarquee';
import { AnimatedMessages } from './AnimatedMessages';
import { ReportsAnimation } from './ReportsAnimation';
import { TaskListAnimation } from './TasksListAnimation';

const features = [
  {
    Icon: MessagesSquare,
    name: 'Real time messaging',
    description:
      'Connect with your team in real-time, fostering collaboration and enhancing communication with public and private channels.',
    className: 'col-span-3 lg:col-span-1',
    cta: 'Get started',
    href: '/team/new',
    background: (
      <AnimatedMessages className='absolute left-0 lg:right-2 top-0 h-[300px] w-[600px] lg:w-auto border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105' />
    ),
    small: true,
  },
  {
    Icon: HardDrive,
    name: 'Storages',
    description:
      'Upload and store all type of files. Share them within your team.',
    className: 'col-span-3 lg:col-span-2',
    background: <FilesMarquee />,
    cta: 'Get started',
    href: '/team/new',
    small: true,
  },
  {
    Icon: CheckSquare,
    name: 'Custom tasks',
    description:
      'Unleash the full potential of your team. Collaborate effortlessly as a team, assign and track tasks, and visualize progress in real-time.',
    className: 'col-span-3 lg:col-span-2',
    cta: 'Get started',
    href: '/team/new',
    background: (
      <TaskListAnimation className='absolute right-0 lg:right-16 top-0 h-[300px] w-[600px] lg:w-auto border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105' />
    ),
    small: true,
  },
  {
    Icon: Bug,
    name: 'Streamlining Bug Reporting',
    description:
      'Our bug tracking and reporting feature enables members to easily track, document, and report bugs within your application. Being able to transform them into tasks.',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <ReportsAnimation className='absolute -right-10 -bottom-24 lg:-right-2 lg:-bottom-0 h-[300px] w-[500px] border-none transition-all duration-300 ease-out' />
    ),
    cta: 'Get started',
    href: '/team/new',
    small: true,
  },
];

const Features = () => {
  return (
    <div className='p-2 px-10 lg:px-32 xl:px-56'>
      <div className='flex flex-col items-center justify-center gap-2.5'>
        <h5 className='p-1 px-6 rounded-full'>
          <span className='bg-gradient-to-b from-orange-400 from-40% to-orange-600 bg-clip-text text-transparent'>
            OUR FEATURES
          </span>
        </h5>
        <h6 className='text-center text-3xl max-w-xl'>
          Wondering if there is a more efficient way to organize your team?
        </h6>
      </div>
      <BentoGrid className='mt-12'>
        {features.map((feature, idx) => (
          <BentoCard
            key={idx}
            {...feature}
          />
        ))}
      </BentoGrid>
    </div>
  );
};

export default Features;
