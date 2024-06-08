import { GetAllEmployees } from "@/api/employeeApi.ts";
import ThemeSwitch from "@/components/theme-switch";
import { Layout, LayoutBody, LayoutHeader } from "@/components/ui/layout";
import Loader from "@/components/ui/loader.tsx";
import { UserNav } from "@/components/user-nav";
import { useQueries } from "@tanstack/react-query";
import EmployeesTable from "./components/employee-table.tsx";

export default function Employee() {
	const [employeesQuery] = useQueries({
		queries: [
			{
				queryKey: ["employees"],
				queryFn: GetAllEmployees,
			},
		],
	});

	const isSuccess = employeesQuery.isSuccess;

	return (
		<Layout>
			<LayoutHeader>
				<div className="ml-auto flex items-center space-x-4">
					<ThemeSwitch />
					<UserNav />
				</div>
			</LayoutHeader>
			{!isSuccess && (
				<div className="flex items-center justify-center w-full">
					<Loader />
				</div>
			)}
			{isSuccess && (
				<LayoutBody className="space-y-4">
					<div className="flex items-center justify-end space-y-2">
						<div className="flex items-center justify-between w-full space-x-3">
							<h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
								Сотрудники
							</h1>
						</div>
					</div>
					<div className="w-full h-full">
						<EmployeesTable employeeDetails={employeesQuery.data.employees} />
					</div>
				</LayoutBody>
			)}
		</Layout>
	);
}
