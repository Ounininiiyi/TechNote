import React , {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { Button, Form } from 'react-bootstrap'
import { ROLES } from '../../config/roles'
import { useAddNewUserMutation } from './usersApiSlice'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

function NewUserForm() {
    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(['Employee'])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if(isSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    const onSaveUserClicked = async(e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({username, password, roles})
        }
    }

    const options = Object.values(ROLES).map(role => {
        return <option value={role} key={role}>{role}</option>
    })
    const errClass = isError ? 'errmsg' : 'offscreen'
    const validUserClass = !validUsername ? 'form-input' : ''
    const validPwdClass = !validPassword ? 'form-input' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form-input' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <Form onSubmit={onSaveUserClicked}>
                <div className='form-title'>
                    <h2>New User</h2>
                    <Button type='submit' className='icon-button button-div' title='Save' disabled={!canSave}>
                        <FontAwesomeIcon icon={faSave} />
                    </Button>
                </div>
                <Form.Group>
                    <Form.Label htmlFor='username'>
                        Username: <span className="nowrap">[3-20 letters]</span>
                    </Form.Label>
                    <Form.Control className={`form-input ${validUserClass}`} id='username' name='username' type='text' autoComplete='off' value={username} onChange={onUsernameChanged} />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor='password'>
                        Password: <span className='nowrap'>[4-12 chars incl. !@#$%]</span>
                    </Form.Label>
                    <Form.Control className={`form-input ${validPwdClass}`} id='password' name='password' type='password' value={password} onChange={onPasswordChanged} />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor='roles'>
                        ASSIGNED ROLES:
                    </Form.Label>
                    <Form.Select id='roles' name='roles' className={`form-select ${validRolesClass}`} multiple={true} size='3' value={roles} onChange={onRolesChanged}>
                        {options}
                    </Form.Select>
                </Form.Group>
            </Form>
        </>
    )

    return content
}

export default NewUserForm
