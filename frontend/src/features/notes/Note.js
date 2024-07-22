import React, {memo} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import {useGetNotesQuery} from './notesApiSlice'

function Note({noteId}) {
    const {note} = useGetNotesQuery('notesList', {
        selectFromResult: ({data}) => ({
            note: data?.entities[noteId]
        }),
    }) 
    const navigate = useNavigate()

    if (note) {
        const created = new Date(note.createdAt).toLocaleString('en-US', {day: 'numeric', month: 'long'})
        const updated = new Date(note.updatedAt).toLocaleString('en-US', {day: 'numeric', month: 'long'})
        const handleEdit = () => navigate(`/dash/notes/${noteId}`)

        return (
            <tr>
                <td>
                    {note.completed
                        ? <span className='complete'>Completed</span>
                        : <span className='open'>Open</span>
                    }
                </td>
                <td>{created}</td>
                <td>{updated}</td>
                <td>{note.title}</td>
                <td>{note.username}</td>

                <td>
                    <Button className='icon-button table-button' onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                </td>
            </tr>
        )
    } else return null
}

const memoizedNote = memo(Note)

export default memoizedNote
