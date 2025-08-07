import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();
    const displayName = user.name?.trim() || 'کاربر گرامی';

    return (
        <>

            <div className="w-full flex gap-4 items-center gap-2">
                <div className=''>
                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                        <AvatarImage src={user.avatar} alt={displayName} />
                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black">
                            {getInitials(displayName)}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <span className="truncate font-medium">{displayName}</span>
                    {showEmail && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
                </div>


            </div>

        </>
    );
}
