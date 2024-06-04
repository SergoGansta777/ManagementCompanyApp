import { DataTableViewOptions } from "@/components/data-table-view-options.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";
import { CirclePlus, Download } from "lucide-react";
import { CSVLink } from "react-csv";
import type { Data } from "react-csv/lib/core";
import NewEmployeeForm from "./add-employee-form";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	dataToExport: TData[];
}

export function DataTableToolbar<TData>({
	table,
	dataToExport,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex items-center justify-between">
			<div
				className="flex flex-1 flex-col-reverse items-start gap-y-2
        sm:flex-row sm:items-center sm:space-x-2"
			>
				<Input
					placeholder="Поиск сотрудника по фамилии..."
					value={
						(table.getColumn("lastName")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("lastName")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Сбросить
						<Cross2Icon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<div className="flex justify-between items-center gap-2">
				<CSVLink data={dataToExport as Data} filename="employee.csv">
					<Button variant="secondary" className="h-8 px-2 lg:px-3 ">
						<Download className="px-1" />
						Экспорт
					</Button>
				</CSVLink>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="default" className="h-8 px-2 lg:px-3 ">
							<CirclePlus className="px-1" />
							Добавить сотрудника
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader className="text-3xl tracking-wide font-semibold">
							Добавление сотрудника
						</DialogHeader>
						<DialogDescription>
							Пожалуйста, предоставьте всю необходимую информацию о новом
							сотруднике
						</DialogDescription>
						<NewEmployeeForm />
					</DialogContent>
				</Dialog>
				<DataTableViewOptions table={table} />
			</div>
		</div>
	);
}
