import type { TableDefinition } from '@/ts'

const CentersTable: TableDefinition = {
    name: 'centers',
    columns: {
        _id: 'text',
        Name: 'text',
        Phone: 'text',
        Address: 'text',
        City: 'text',
        Country: 'text',
        Location: 'json',
        Active: 'boolean',
        Created_At: 'date',
        Updated_At: 'date',
        Deleted: 'boolean',
        Deleted_At: 'date'
    }
}

export default CentersTable