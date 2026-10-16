export const PostListSelector = [
    '_id',
    'Title',
    'BloodGroup',
    'Status',
    'City',
    'Country',
    'User',
    'Description',
    'Type',
    'Urgent',
    'Created_At'
]

export const CityListSelector = ['_id', 'Name', 'Value', 'Posts', 'Users', 'Country']

export const CountryListSelector = ['_id', 'Name', 'Posts', 'Users', 'Cities', 'Code']