import React, {memo} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useGetUsersQuery } from './usersApiSlice'

function User({userId}) {
    const {user} = useGetUsersQuery('usersList', {
        selectFromResult: ({data}) => ({
            user: data?.entities[userId]
        }),
    })

    const navigate = useNavigate()

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`)
        const userRolesString = user.roles.toString().replaceAll(',', ', ')
        const cellStatus = user.active ? '' : 'tableCell--inactive'

        return (
            <tr>
                <td className={`tableCell ${cellStatus}`}>{user.username}</td>
                <td className={`tableCell ${cellStatus}`}>{userRolesString}</td>
                <td className={`tableCell ${cellStatus}`}>
                    <Button className='icon-button table-button' onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                </td>
            </tr>
        )
    } else return null
}

const memoizedUser = memo(User)

export default memoizedUser
