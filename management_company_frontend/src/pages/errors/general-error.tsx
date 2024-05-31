import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean;
}

export default function GeneralError({
                                       className,
                                       minimal = false
                                     }: GeneralErrorProps) {
  const navigate = useNavigate()
  return (
    <div className={cn('h-svh w-full', className)}>
      <div
        className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && (
          <h1 className='text-[7rem] font-bold leading-tight'>500</h1>
        )}
        <span className='font-medium'>Упс! Что-то пошло не так {`:')`}</span>
        <p className='text-center text-muted-foreground'>
          Мы приносим извинения за неудобства. <br /> Пожалуйста, попробуйте
          снова позже.
        </p>
        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' onClick={() => navigate(-1)}>
              Назад
            </Button>
            <Button onClick={() => navigate('/')}>На главную</Button>
          </div>
        )}
      </div>
    </div>
  )
}