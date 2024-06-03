import axiosInstance from '@/api/axiosInstance.ts'
import type {
	Employee,
	EmployeeDetailsList,
	NewEmployee,
	UpdateEmployee,
} from '@/types'

export const GetAllEmployeesDetails = async () => {
	const response = await axiosInstance.get<EmployeeDetailsList>('/employees')
	return response.data
}

export const AddEmployee = async (NewEmployee: NewEmployee) => {
	const response = await axiosInstance.post<Employee>('/employees', NewEmployee)
	return response.data
}

export const UpdateEmployeeWithId = async (updatedEmployee: UpdateEmployee) => {
	const response = await axiosInstance.post<Employee>(
		`/employee/${updatedEmployee.id}`,
		updatedEmployee
	)
	return response.data
}
