import { DataTable } from '@/pages/incidents/components/data-table.tsx'
import type { IncidentDetails } from '@/types'
import TableColumns from './table-columns'

interface IncidentTableProps {
  incidentsDetails: IncidentDetails[];
}

const IncidentsTable = ({ incidentsDetails }: IncidentTableProps) => {
  const columns = TableColumns()
  return (
    <div
      className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
      <DataTable data={incidentsDetails} columns={columns} />
    </div>
  )
}
export default IncidentsTable
