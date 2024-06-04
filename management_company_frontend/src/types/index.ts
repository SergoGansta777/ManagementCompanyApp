import { z } from 'zod'

export const ruMoneyFormat = new Intl.NumberFormat('ru-Ru', {
	style: 'currency',
	currency: 'RUB',
	maximumSignificantDigits: 3,
})

export const ruDateFormat = new Intl.DateTimeFormat('ru-RU', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
})
export const NewEmployeeSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	middleName: z.string().optional(),
	email: z.string().email(),
	phone: z.string().min(1),
	gender: z.string().min(1),
	positionId: z.string().uuid(),
	passportSeries: z.number().min(4).max(4),
	passportNumber: z.number().min(6).max(6),
})

export type NewEmployee = z.infer<typeof NewEmployeeSchema>

export const PositionAtWorkSchema = z.object({
	id: z.string(),
	name: z.string(),
	salary: z.number(),
})

export type PositionAtWork = z.infer<typeof PositionAtWorkSchema>

export interface PositionsList {
	positions: PositionAtWork[]
}

export const UpdateEmployeeSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	middleName: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	gender: z.string().optional(),
	positionId: z.string().uuid().optional(),
})

export type UpdateEmployee = z.infer<typeof UpdateEmployeeSchema>

export const UpdateEmployeeWrapperSchema = z.object({
	id: z.string().uuid(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	middleName: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	gender: z.string().optional(),
	positionId: z.string().uuid().optional(),
})

export type UpdateWrapperEmployee = z.infer<typeof UpdateEmployeeWrapperSchema>

export const EmployeeSchema = z.object({
	id: z.string().uuid(),
	firstName: z.string(),
	lastName: z.string(),
	middleName: z.string().optional(),
	email: z.string().email(),
	phone: z.string(),
	gender: z.string(),
	positionId: z.string().uuid(),
	passportId: z.string().uuid(),
})

export type Employee = z.infer<typeof EmployeeSchema>

export const EmployeeDetailsSchema = z.object({
	id: z.string().uuid(),
	firstName: z.string(),
	lastName: z.string(),
	middleName: z.string().optional(),
	email: z.string().email(),
	phone: z.string(),
	gender: z.string(),
	positionName: z.string(),
	positionSalary: z.string(),
	passportSeries: z.number(),
	passportNumber: z.number(),
})

export type EmployeeDetails = z.infer<typeof EmployeeDetailsSchema>

export const EmployeeDetailsListSchema = z.object({
	employees: z.array(EmployeeDetailsSchema),
})

export type EmployeeDetailsList = z.infer<typeof EmployeeDetailsListSchema>

export const EmployeeListSchema = z.object({
	employees: z.array(EmployeeSchema),
})

export type EmployeeList = z.infer<typeof EmployeeListSchema>

export const IncidentStatusSchema = z.enum([
	'Reported',
	'InProgress',
	'Resolved',
	'Closed',
	'Cancelled',
])

export type IncidentStatus = z.infer<typeof IncidentStatusSchema>

export const AddressSchema = z.object({
	country: z.string(),
	region: z.string(),
	city: z.string(),
	street: z.string(),
})

export type Address = z.infer<typeof AddressSchema>

export const BuildingSchema = z.object({
	id: z.string().uuid(),
	number: z.number().int(),
	numberOfFloors: z.number().int(),
	address: AddressSchema,
	constructedDate: z.string().transform(str => new Date(str)), // NaiveDate parsing
})

export type Building = z.infer<typeof BuildingSchema>

export const IncidentTypeSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
})

export type IncidentType = z.infer<typeof IncidentTypeSchema>

export const IncidentDetailsSchema = z.object({
	id: z.string().uuid(),
	building: BuildingSchema,
	reportedAt: z.string().transform(str => new Date(str)), // Date parsing
	resolvedAt: z
		.string()
		.nullable()
		.transform(str => (str ? new Date(str) : null))
		.optional(),
	status: IncidentStatusSchema,
	description: z.string().nullable().optional(),
	incidentType: IncidentTypeSchema,
})

export type IncidentDetails = z.infer<typeof IncidentDetailsSchema>

export const IncidentListSchema = z.object({
	incidents: z.array(IncidentDetailsSchema),
})

export type IncidentDetailList = z.infer<typeof IncidentListSchema>

export interface IUserResponse {
	token: string
}

export interface IUser extends IUserResponse {
	email: string
	firstName: string
	lastName: string
}

export const loginScheme = z.object({
	email: z
		.string()
		.min(1, { message: 'Пожалуйста, введите электронную почту' })
		.email({ message: 'Электронный адрес некорректен' }),
	password: z.string().min(3, {
		message: 'Пожалуйста, введите пароль учетной записи не менее 3 символов',
	}),
})

export type LoginInput = z.infer<typeof loginScheme>

export const signupScheme = z.object({
	employee_id: z
		.string()
		.min(1, { message: 'Пожалуйста, введите идентификатор сотрудника' })
		.uuid({
			message: 'Пожалуйста, введите корректный идентификатор сотрудника',
		}),
	email: z
		.string()
		.min(1, { message: 'Пожалуйста, введите электронную почту' })
		.email({ message: 'Электронный адрес некорректен' }),
	password: z.string().min(3, {
		message: 'Пожалуйста, введите пароль учетной записи не менее 3 символов',
	}),
})

export type SignupInput = z.infer<typeof signupScheme>

export interface ExpenseDistributionByMonth {
	name: string
	total: number
}

export interface IncidentTypeStatistic {
	id: string
	name: string
	count: number
	percentage: string
}

export interface StatisticOverviewLastYear {
	totalExpensesLastYear: string
	percentChangesInExpenseFromLastYear: string
	countOfRepairsLastYear: number
	percentChangesInCountRepairLastYear: string
	countOfActiveRepairRequests: number
	percentChangesInActiveRepairRequestsLastYear: string
	countOfEmployees: number
	countNewEmployeeLastYear: number
	expenseDistributionByMonthLastYear: ExpenseDistributionByMonth[]
	totalIncidentsLastYear: number
	top5IncidentTypesLastYear: IncidentTypeStatistic[]
}

export interface RepairCount {
	emergencyRepairs: number
	scheduledRepairs: number
	total: number
}

export interface IncidentCost {
	incidentType: string
	totalCost: number
}

export interface BuildingRepairCost {
	buildingId: string
	buildingNumber: number
	totalCost: number
	repairCount: number
}

export interface Overview {
	buildingId: string
	totalIncidents: number
	totalCost: number
	repairCounts: RepairCount
	incidentCosts: IncidentCost[]
	topBuildingsByRepairCost: BuildingRepairCost[]
}

export interface QueryTimeDiapasonParams {
	startDate: string // DateTime as ISO string
	endDate: string // DateTime as ISO string
}
