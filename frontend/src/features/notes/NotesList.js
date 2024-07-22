import React from 'react'
import { Table } from 'react-bootstrap'
import { useGetNotesQuery } from './notesApiSlice'
import Note from './Note'
import useAuth from '../../hooks/useAuth'

function NotesList() {
  const {username, isManager, isAdmin} = useAuth()

  const {
    data: notes, 
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetNotesQuery('notesList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content 
  if (isLoading) content = <p>Loading ...</p>
  if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>
  }
  if (isSuccess) {
    const {ids, entities} = notes

    let filteredIds 
    if (isManager || isAdmin) {
      filteredIds = [...ids]
    } else {
      filteredIds = ids.filter(noteId => entities[noteId].username === username)
    }

    const tableContent = ids?.length && filteredIds.map(noteId => <Note key={noteId} noteId={noteId} />) 

    content = (
      <Table striped bordered hover variant='dark'>
        <thead>
          <tr>
            <th>Username</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Title</th>
            <th>Owner</th>
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

export default NotesList
