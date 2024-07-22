import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'

function Public() {
    const content = (
        <section className='public'>
            <Container fluid>
                <header>
                    <h1>Welcome to <span className='nowrap'>Dan D. Repairs!</span></h1>
                </header>
                <main className='public-main'>
                    <p>Located in Beautiful Downtown Foo City, Dan D. Repairs provides a trained staff ready to met yout tech repair needs.</p>
                    <address className='public-addr'>
                        Dan D. Repairs<br />
                        555 Foo Driv<br />
                        Foo City, CA 12345<br />
                        <a href="tel:+1555555555">(555) 555-5555</a>
                    </address>
                    <br />
                    <p className='owner'>Owner: Dan Davidson</p>
                </main>
                <footer>
                    <Link to='/login'>Employee Login</Link>
                </footer>
            </Container>
        </section>
    )
    return content
}

export default Public


