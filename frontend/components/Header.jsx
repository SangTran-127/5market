import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { ConnectButton, ConnectDialog } from "@connect2ic/react"
const Header = ({ principal }) => {

    return (
        <Navbar collapseOnSelect expand="lg" sticky='top'>
            <Container className='navbar__container'>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Brand href='/home' >
                    <div className='d-inline-block align-top'>
                        5Market
                    </div>
                </Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className='ms-auto d-flex align-items-center'>
                        <Nav.Link to='/discover' as={NavLink}>
                            Discover
                        </Nav.Link>
                        <Nav.Link to='/mint' as={NavLink}>
                            Mint NFT
                        </Nav.Link>
                        {

                            principal ? <Nav.Link to="/register" as={NavLink}>
                                Register
                            </Nav.Link> : null


                        }
                        <Nav.Link to='/collection' as={NavLink}>
                            {principal ? "My NFTs" : null}
                        </Nav.Link>
                        <Nav.Link to='/transfer' as={NavLink}>
                            {principal ? "Transfer" : null}
                        </Nav.Link>
                        <Nav.Link to='/profile' as={NavLink}>
                            {principal ? "view profile" : null}
                        </Nav.Link>
                        <Nav.Link>
                            <ConnectButton />
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>

            </Container>
            <ConnectDialog />
        </Navbar >
    )
}

export default Header