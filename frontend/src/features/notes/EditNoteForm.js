import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom"
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from '../../hooks/useAuth'

function EditNoteForm({note, users}) {
    const {isManager, isAdmin} = useAuth()

    const [updateNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateNoteMutation()

    const [deleteNote, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteNoteMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(note.title)
    const [text, setText] = useState(note.text)
    const [completed, setCompleted] = useState(note.completed)
    const [userId, setUserId] = useState(note.user)

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/notes')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveNoteClicked = async (e) => {
        if (canSave) {
            await updateNote({ id: note.id, user: userId, title, text, completed })
        }
    }

    const onDeleteNoteClicked = async () => {
        await deleteNote({ id: note.id })
    }

    const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )
    })

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form-input--incomplete" : ''
    const validTextClass = !text ? "form-input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    let deleteButton = null
    if (isManager || isAdmin) {
        deleteButton = (
            <Button className='icon-button' title='Delete' onClick={onDeleteNoteClicked}>
                <FontAwesomeIcon icon={faTrashCan} />
            </Button>
        )
    }

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <Form className='editNote' onSubmit={e => e.preventDefault()}>
                <div className="form-title">
                    <h2>Edit Note #{note.ticket}</h2>
                    <div className="button-div">
                        <Button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveNoteClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </Button>
                        {deleteButton}
                    </div>
                </div>
                <Form.Group>
                    <Form.Label htmlFor="note-title">
                        Title:</Form.Label>
                    <Form.Control
                        className={`form-input ${validTitleClass}`}
                        id="note-title"
                        name="title"
                        type="text"
                        autoComplete="off"
                        value={title}
                        onChange={onTitleChanged}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="note-text">
                        Text:</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows='4'
                        className={`form-input ${validTextClass}`}
                        id="note-text"
                        name="text"
                        value={text}
                        onChange={onTextChanged}
                    />
                </Form.Group>
                <Row>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label htmlFor="note-completed">
                                WORK COMPLETE:
                            </Form.Label>
                            <input
                                className='form-check-input'
                                id="note-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="note-username">
                                ASSIGNED TO:</Form.Label>
                            <Form.Select
                                id="note-username"
                                name="username"
                                value={userId}
                                onChange={onUserIdChanged}
                            >
                                {options}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <div className='form-stats'>
                            <p className="form-created">Created:<br />{created}</p>
                            <p className="form-updated">Updated:<br />{updated}</p>
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
    )

    return content
}

export default EditNoteForm
