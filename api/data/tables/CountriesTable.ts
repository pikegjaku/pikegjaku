import type { TableDefinition } from '@/ts'

const CountriesTable: TableDefinition = {
    name: 'countries',
    columns: {
        _id: 'text',
        Name: 'text',
        Code: 'number',
        Cities: 'number',
        Posts: 'number',
        Users: 'number',
        Created_At: 'date',
        Updated_At: 'date',
        Deleted: 'boolean',
        Deleted_At: 'date'
    }
}

export default CountriesTable