import React from 'react'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader';
import DashFooter from './DashFooter';

function DashLayout() {
    return (
        <>
            <DashHeader />
            <Container fluid className='con'>
                <Outlet />  
            </Container> 
            <DashFooter />
        </>
    )
}

export default DashLayout
