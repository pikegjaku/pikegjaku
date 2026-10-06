import type { TableDefinition } from '@/ts'

const PostsTable: TableDefinition = {
    name: 'posts',
    columns: {
        _id: 'text',
        Title: 'text',
        Description: 'text',
        Type: 'text',
        BloodGroup: 'text',
        Urgent: 'boolean',
        Status: 'text',
        Reach: 'number',
        User: 'text',
        Country: 'text',
        City: 'text',
        Views: 'number',
        Deleted: 'boolean',
        Deleted_At: 'date',
        Created_At: 'date',
        Updated_At: 'date'
    }
}

export default PostsTable