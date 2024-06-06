import { DataTable } from '@/pages/repairs/components/data-table.tsx'
import type { Repair } from '@/types'
import TableColumns from './table-columns'

interface RepairTableProps {
  repairs: Repair[];
}

const RepairTable = ({ repairs }: RepairTableProps) => {
  const columns = TableColumns()
  return (
    <div
      className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
      <DataTable data={repairs} columns={columns} />
    </div>
  )
}
export default RepairTable
