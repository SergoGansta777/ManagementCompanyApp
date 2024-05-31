import { GetCurrentUser } from '@/api/authApi'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/context/authContext'
import { useQuery } from '@tanstack/react-query'

export function UserNav() {
  const { data: queryData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: GetCurrentUser
  })
  const { logout } = useAuth()
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback>
              {queryData?.user?.firstName.at(0)}
              {queryData?.user?.lastName.at(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {queryData?.user?.firstName + ' ' + queryData?.user?.lastName}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {queryData?.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
