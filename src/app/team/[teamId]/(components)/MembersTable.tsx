import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Doc, Id } from '../../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';

type MembersTableProps = {
  members: (Doc<'users'> & {
    memberId: Id<any>;
    teamId: Id<'teams'>;
  })[];
  memberDeleteFn: (memberId: Id<any>) => Promise<void>;
};

const MembersTable = ({ members, memberDeleteFn }: MembersTableProps) => {
  const handleDeleteMember = async (memberId: Id<any>) => {
    try {
      await memberDeleteFn(memberId);
      toast.success('Member deleted successfully');
    } catch {
      toast.error('Failed to delete member');
    }
  };

  return (
    <ul className='mt-2.5'>
      {members.length > 0 ? (
        members.map(member => (
          <li
            key={member._id}
            className='flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/60 group'
          >
            <div className='flex items-center gap-2.5'>
              <Avatar>
                <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
                <AvatarImage src={member.profileImage} />
              </Avatar>
              <p>{member.fullName}</p>
            </div>
            <Button
              size='icon'
              variant='outline'
              className='opacity-0 group-hover:opacity-100'
              onClick={() => handleDeleteMember(member.memberId)}
            >
              <Trash2 className='size-4' strokeWidth={1.5} />
            </Button>
          </li>
        ))
      ) : (
        <p>No members</p>
      )}
    </ul>
  );
};

export default MembersTable;
