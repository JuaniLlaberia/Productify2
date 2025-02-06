import { cn } from '@/lib/utils';
import { Marquee } from '../marquee';

const files = [
  {
    name: 'requirements.txt',
    description:
      'A list of dependencies needed for a project, often used in Python projects.',
  },
  {
    name: 'design-doc.md',
    description:
      'A document outlining software architecture, features, or implementation plans.',
  },
  {
    name: 'task-list.csv',
    description:
      'A shared task tracker in CSV format, listing assignments and progress.',
  },
  {
    name: 'release-notes.md',
    description:
      'A file documenting updates, bug fixes, and new features in each release.',
  },
  {
    name: 'team-guidelines.pdf',
    description:
      'A document with coding standards, best practices, or collaboration rules.',
  },
  {
    name: 'sprint-backlog.xlsx',
    description:
      'A spreadsheet tracking tasks, priorities, and progress during a sprint.',
  },
];

export const FilesMarquee = () => {
  return (
    <Marquee
      pauseOnHover
      className='absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] '
    >
      {files.map((file, idx) => (
        <figure
          key={idx}
          className={cn(
            'relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4',
            'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
            'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
            'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none'
          )}
        >
          <div className='flex flex-row items-center gap-2'>
            <div className='flex flex-col'>
              <figcaption className='text-xs font-medium dark:text-white '>
                {file.name}
              </figcaption>
            </div>
          </div>
          <blockquote className='mt-2 text-xs'>{file.description}</blockquote>
        </figure>
      ))}
    </Marquee>
  );
};
