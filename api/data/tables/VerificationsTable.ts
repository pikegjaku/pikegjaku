import type { TableDefinition } from '@/ts'

const VerificationsTable: TableDefinition = {
    name: 'verifications',
    columns: {
        _id: 'text',
        User: 'text',
        Type: 'text',
        Code: 'number',
        Expired: 'boolean',
        Attempts: 'number',
        Used: 'boolean',
        Expires_At: 'date',
        Generated_At: 'date',
        Metadata: 'json'
    }
}

export default VerificationsTable