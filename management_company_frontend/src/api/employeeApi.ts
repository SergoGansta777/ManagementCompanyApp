import axiosInstance from '@/api/axiosInstance.ts'
import type {
  Employee,
  EmployeeDetailsList,
  NewEmployee,
  PositionsList,
  UpdateWrapperEmployee
} from '@/types'

export const GetAllEmployees = async () => {
  const response = await axiosInstance.get<EmployeeDetailsList>('/employees')
  return response.data
}

export const AddEmployee = async (NewEmployee: NewEmployee) => {
  const response = await axiosInstance.post<Employee>('/employees', {
    employee: NewEmployee
  })
  return response.data
}

export const UpdateEmployeeWithId = async (
  updatedEmployee: UpdateWrapperEmployee
) => {
  const response = await axiosInstance.put<Employee>(
    `/employee/${updatedEmployee.id}`,
    updatedEmployee
  )
  return response.data
}

export const DeleteEmployeeWithId = async (id: string) => {
  const response = await axiosInstance.delete(`employee/${id}`)
  return response.data
}

export const GetAllPositionsAtWork = async () => {
  const response = await axiosInstance.get<PositionsList>('/positions')
  return response.data
}
