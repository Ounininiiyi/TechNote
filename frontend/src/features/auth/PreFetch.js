import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { store } from '../../app/store';
import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'

function PreFetch() {
    useEffect(() => {
        store.dispatch(notesApiSlice.util.prefetch('getNotes', 'notesList', {force: true}))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', {force: true}))
    }, [])

    return <Outlet />
}

export default PreFetch
