import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom"
import { Form, Button } from 'react-bootstrap'
import { useAddNewNoteMutation } from "./notesApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

function NewNoteForm({users}) {
    const [addNewNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewNoteMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [userId, setUserId] = useState(users[0].id)

    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/notes')
        }
    }, [isSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveNoteClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewNote({ user: userId, title, text })
        }
    }

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}
            > {user.username}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form-input" : ''
    const validTextClass = !text ? "form-input" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <Form className='editNote' onSubmit={onSaveNoteClicked}>
                <div className="form-title">
                    <h2>New Note</h2>
                    <Button type='submit' className="icon-button button-div" title="Save" disabled={!canSave}>
                        <FontAwesomeIcon icon={faSave} />
                    </Button>
                </div>
                <Form.Group>
                    <Form.Label htmlFor="title">
                        Title:</Form.Label>
                    <Form.Control
                        className={`form-input ${validTitleClass}`}
                        id="title"
                        name="title"
                        type="text"
                        autoComplete="off"
                        value={title}
                        onChange={onTitleChanged}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="text">
                        Text:</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows='3'
                        className={`form-input ${validTextClass}`}
                        id="text"
                        name="text"
                        value={text}
                        onChange={onTextChanged}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="username">
                    ASSIGNED TO:
                    </Form.Label>
                    <Form.Select
                        id="username"
                        name="username"
                        className="form-select"
                        value={userId}
                        onChange={onUserIdChanged}
                    >
                        {options}
                    </Form.Select>
                </Form.Group>
            </Form>
        </>
    )

    return content
}

export default NewNoteForm
