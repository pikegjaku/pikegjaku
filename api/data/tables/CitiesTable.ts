import type { TableDefinition } from '@/ts'

const CitiesTable: TableDefinition = {
    name: 'cities',
    columns: {
        _id: 'text',
        Name: 'text',
        Value: 'text',
        Posts: 'number',
        Users: 'number',
        Country: 'text',
        Created_At: 'date',
        Updated_At: 'date',
        Deleted: 'boolean',
        Deleted_At: 'date'
    }
}

export default CitiesTable