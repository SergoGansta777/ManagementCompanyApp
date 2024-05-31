import { z } from 'zod'

export interface IUserResponse {
  token: string;
}

export interface IUser extends IUserResponse {
  email: string;
  firstName: string;
  lastName: string;
}

export const loginScheme = z.object({
  email: z
    .string()
    .min(1, { message: 'Пожалуйста, введите электронную почту' })
    .email({ message: 'Электронный адрес некорректен' }),
  password: z
    .string()
    .min(3, {
      message: 'Пожалуйста, введите пароль учетной записи не менее 3 символов'
    })
})

export type LoginInput = z.infer<typeof loginScheme>;

export const signupScheme = z.object({
  employee_id: z.string().min(1, { message: 'Пожалуйста, введите идентификатор сотрудника' }).uuid({ message: 'Пожалуйста, введите корректный идентификатор сотрудника' }),
  email: z
    .string()
    .min(1, { message: 'Пожалуйста, введите электронную почту' })
    .email({ message: 'Электронный адрес некорректен' }),
  password: z.string().min(3, {
    message: 'Пожалуйста, введите пароль учетной записи не менее 3 символов'
  })
})

export type SignupInput = z.infer<typeof signupScheme>;
