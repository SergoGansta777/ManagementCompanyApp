import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { LoginForm } from './components/login-form'

export default function SignIn() {
  return (
    <div className='flex w-full h-screen'>
      <div className='w-full flex items-center justify-center'>
        <Card className='mx-auto max-w-lg p-6 rounded-xl'>
          <CardHeader className='mb-0.5 flex flex-col space-y-2 text-left'>
            <CardTitle className='text-3xl tracking-wide'>Вход в
              систему</CardTitle>
            <CardDescription>
              Введите email и пароль учетной записи
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className='text-sm text-muted-foreground'>
            Нет учетной записи?
            <Link
              to='/signup'
              className='px-1 underline underline-offset-4 hover:text-primary'
            >
              Зарегистрироваться
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
