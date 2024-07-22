import React from 'react'
import { Table } from 'react-bootstrap'
import { useGetUsersQuery } from './usersApiSlice';
import User from './User';

function UsersList() {
    const {
        data: users, 
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('usersList' , {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content 
    if (isLoading) content = <p>Loading ...</p>
    if (isError) {
        content = <p className={isError.toString()}>{error?.data?.message}</p>
    }
    if (isSuccess) {
        const {ids} = users
        
        const tableContent = ids?.length && ids.map(userId => <User key={userId} userId={userId} />) 

        content = (
            <Table striped bordered hover variant='dark'>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Roles</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </Table>
        )
    }
    return content
}

export default UsersList
