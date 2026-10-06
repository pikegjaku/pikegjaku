import type { TableDefinition } from '@/ts'

const WaitlistsTable: TableDefinition = {
    name: 'waitlists',
    columns: {
        _id: 'text',
        Email: 'text',
        Subscribed_At: 'date',
        Metadata: 'json'
    }
}

export default WaitlistsTable