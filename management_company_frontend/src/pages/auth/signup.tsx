import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { SignUpForm } from './components/signup-form'

export default function SignUp() {
  return (
    <div className='flex w-full h-screen'>
      <div
        className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
        <Card className='p-6'>
          <CardHeader className='mb-0.5 flex flex-col space-y-2 text-left'>
            <CardTitle className='text-3xl tracking-wide'>
              Регистрация
            </CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>
              Создайте учетную запись сотрудника
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
          <CardFooter className='text-sm text-muted-foreground'>
            Уже есть аккаунт?
            <Link
              to='/login'
              className='px-1 underline underline-offset-4 hover:text-primary'
            >
              Войти
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
