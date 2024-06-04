import type { EmployeeDetails } from "@/types/index.ts";
import { DataTable } from "./data-table.tsx";
import TableColumns from "./table-columns";

interface EmployeesTableProps {
	employeeDetails: EmployeeDetails[];
}

const EmployeesTable = ({ employeeDetails }: EmployeesTableProps) => {
	const columns = TableColumns();
	return (
		<div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
			<DataTable data={employeeDetails} columns={columns} />
		</div>
	);
};
export default EmployeesTable;
