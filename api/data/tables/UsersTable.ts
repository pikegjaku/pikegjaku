import type { TableDefinition } from '@/ts'

const UsersTable: TableDefinition = {
    name: 'users',
    columns: {
        _id: 'text',
        Name: 'text',
        Surname: 'text',
        Phone: 'text',
        PhoneCountryCode: 'text',
        Avatar: 'text',
        BloodGroup: 'text',
        Role: 'text',
        ProfileCompleted: 'boolean',
        CompletedRegistration: 'boolean',
        Visits: 'number',
        Posts: 'number',
        Country: 'text',
        City: 'text',
        Deleted: 'boolean',
        Deleted_At: 'date',
        Last_Active: 'date',
        Created_At: 'date',
        Updated_At: 'date'
    }
}

export default UsersTable