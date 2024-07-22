import React, {useEffect} from 'react'
import { useNavigate, useLocation} from 'react-router-dom'
import { Nav, Navbar, Container, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faFileCirclePlus, faFilePen, faUserGear, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

function DashHeader() {
    const  {isManager, isAdmin} = useAuth()

    const navigate = useNavigate()
    const {pathname} = useLocation()
    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    const onNewNoteClicked = () => navigate('/dash/notes/new')
    const onNewUserClicked = () => navigate('/dash/users/new')
    const onNotesClicked = () => navigate('/dash/notes')
    const onUsersClicked = () => navigate('/dash/users')

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = 'dashHeaderCon-small'
    }

    let newNoteButton = null
    if (NOTES_REGEX.test(pathname)) {
        newNoteButton = (
            <Button className='icon-button' title='New Note' onClick={onNewNoteClicked}>
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </Button>
        )
    }
    let newUserButton = null
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <Button className='icon-button' title='New User' onClick={onNewUserClicked}>
                <FontAwesomeIcon icon={faUserPlus} />
            </Button>
        )
    }
    let userButton = null
    if (isManager || isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <Button className='icon-button' title='Users' onClick={onUsersClicked}>
                    <FontAwesomeIcon icon={faUserGear} />
                </Button>
            )
        }
    }
    let notesButton = null
    if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
        notesButton = (
            <Button className='icon-button' title='Notes' onClick={onNotesClicked}>
                <FontAwesomeIcon icon={faFilePen} />
            </Button>
        )
    }

    const logoutButton = (
        <Button className='icon-button' title='Logout' onClick={sendLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
        </Button>
    )

    const errClass = isError ? 'errmsg' : 'offscreen'

    let buttonContent 
    if (isLoading) {
        buttonContent = <p>Logging Out...</p>
    } else {
        buttonContent = (
            <>
                {newNoteButton}
                {newUserButton} 
                {notesButton}
                {userButton}
                {logoutButton}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <Navbar expand='sm' className='dashHeader'>
                <Container className={`dashHeader-con ${dashClass}`}>
                    <Navbar.Brand className='dashHeader-title' href='/dash'><h1>techNotes</h1></Navbar.Brand>
                    <Navbar.Toggle aria-controls='dashHeader' />
                    <Navbar.Collapse  id='dashHeader'>
                        <Nav className='dashHeader-nav'>
                            {buttonContent}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )

    return content
}

export default DashHeader