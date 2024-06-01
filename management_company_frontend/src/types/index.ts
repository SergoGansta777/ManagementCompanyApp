import { z } from 'zod'

export const rub_format = new Intl.NumberFormat('ru-Ru', {
  style: 'currency',
  currency: 'RUB',
  maximumSignificantDigits: 3
})

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

export interface ExpenseDistributionByMonth {
  name: string;
  total: number;
}

export interface IncidentTypeStatistic {
  id: string,
  name: string,
  count: number,
  percentage: string
}

export interface StatisticOverviewLastYear {
  totalExpensesLastYear: string;
  percentChangesInExpenseFromLastYear: string;
  countOfRepairsLastYear: number;
  percentChangesInCountRepairLastYear: string;
  countOfActiveRepairRequests: number;
  percentChangesInActiveRepairRequestsLastYear: string;
  countOfEmployees: number;
  countNewEmployeeLastYear: number;
  expenseDistributionByMonthLastYear: ExpenseDistributionByMonth[];
  totalIncidentsLastYear: number;
  top5IncidentTypesLastYear: IncidentTypeStatistic[]
}

export interface RepairCount {
  emergencyRepairs: number;
  scheduledRepairs: number;
  total: number;
}

export interface IncidentCost {
  incidentType: string;
  totalCost: number;
}

export interface BuildingRepairCost {
  buildingId: string,
  buildingNumber: number,
  totalCost: number,
  repairCount: number
}

export interface Overview {
  buildingId: string;
  totalIncidents: number;
  totalCost: number;
  repairCounts: RepairCount;
  incidentCosts: IncidentCost[];
  topBuildingsByRepairCost: BuildingRepairCost[]
}


export interface QueryTimeDiapasonParams {
  startDate: string; // DateTime as ISO string
  endDate: string;   // DateTime as ISO string
}
