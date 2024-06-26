import React from 'react'
import logo from '../components/images/logo.svg'
import { Nav, Row, Col } from 'react-bootstrap'

function Header() {
  return (
    <Nav>
        <Row>
            <Col sm={6}>
                <div className-='header'>
                    <img src={logo} className='logo' alt='logo'/>
                </div>
            </Col>
            <Col sm={6}>
                <div className='navBar'>
                    <Nav.Item herf='#home'> Home</Nav.Item>
                    <Nav.Item herf='#new'> new</Nav.Item>
                    <Nav.Item herf='#popular'> popular</Nav.Item>
                    <Nav.Item herf='#trending'> trending</Nav.Item>
                    <Nav.Item herf='#categogy'> categogy</Nav.Item>
                </div>
            </Col>
        </Row>
    </Nav>
  )
}

export default Header
