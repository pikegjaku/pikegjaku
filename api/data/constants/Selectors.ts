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
    'Created_At'
]

export const CityListSelector = ['_id', 'Name', 'Value', 'Posts', 'Users']

export const CountryListSelector = ['_id', 'Name', 'Posts', 'Users', 'Cities', 'Code']