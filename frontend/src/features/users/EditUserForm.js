import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice';
import { ROLES } from '../../config/roles'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

function EditUserForm({user}) {
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()
    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delError
    }] = useDeleteUserMutation()

    const naviagte = useNavigate()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])
    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            naviagte('/dash/users')
        }
    }, [isSuccess, isDelSuccess, naviagte])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setUsername(e.target.value)
    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }
    const onActiveChanged = () => setActive(prev => !prev)
    const onSaveUserClicked = async(e) => {
        if (password) {
            await updateUser({id: user.id, username, password, roles, active})
        } else {
            await updateUser({id: user.id, username, roles, active})
        }
    }
    const onDeleteUserClicked = async() => {
        await deleteUser({id: user.id})
    }

    const options = Object.values(ROLES).map(role => {
        return  <option key={role} value={role}>{role}</option>
    })

    let canSave
    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? 'errmsg' : 'offscreen'
    const validUserClass = !validUsername ? 'form-input' : ''
    const validPwdClass = !validPassword ? 'form-input' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form-input' : ''
    const errContent = (error?.data?.message || delError?.data?.message) ?? ''
    
    const content = (
        <>
            <p className={errClass}>{errContent}</p>
            <Form onSubmit={e => e.preventDefault()}>
                <div className='form-title'>
                    <h2>Edit User</h2>
                    <div className='button-div'>
                        <Button className='icon-button' title='Save' onClick={onSaveUserClicked} disabled={!canSave}>
                            <FontAwesomeIcon icon={faSave} />
                        </Button>
                        <Button className='icon-button' title='Delete' onClick={onDeleteUserClicked}> 
                            <FontAwesomeIcon icon={faTrashCan} />
                        </Button>
                    </div>
                </div>
                <Form.Group>
                    <Form.Label htmlFor='username'>
                        Username: <span className='nowrap'>[3-20 letters]</span>
                    </Form.Label>
                    <Form.Control className={`form-input ${validUserClass}`} id='username' name='username' type='text' autoComplete='off' value={username} onChange={onUsernameChanged} />
                </Form.Group>
                <Form.Group className='password-group'>
                    <Form.Label htmlFor='password'>
                        Password: <span className='nowrap'>[empty = no change]</span> <span className='nowrap'>[4-12 chars incl. !@#$%]</span>
                    </Form.Label>
                    <Form.Control className={`form-input ${validPwdClass}`} id='password' name='password' type='password' value={password} onChange={onPasswordChanged} />
                </Form.Group>
                <Form.Group className='check' controlId='user-active'>
                    <Form.Label>ACTIVE:</Form.Label>
                    <input className='form-check-input' type='checkbox' id='user-active' name='user-active' checked={active} onChange={onActiveChanged} />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor='roles'>ASSIGNED ROLES:</Form.Label>
                    <Form.Select id='roles' name='roles' className={`form-select ${validRolesClass}`} multiple={true} size='3' value={roles} onChange={onRolesChanged}>
                        {options}
                    </Form.Select>
                </Form.Group>
            </Form>
        </>
    )

    return content
}

export default EditUserForm
