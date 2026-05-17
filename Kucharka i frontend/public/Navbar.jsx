function AppNavbar({ naObrazovku }) {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="px-3 app-navbar">
            <Container fluid>
                <Navbar.Brand
                    href="#"
                    className="d-flex align-items-center gap-2 app-navbar-brand"
                    onClick={(event) => {
                        event.preventDefault();
                        naObrazovku('menu');
                    }}
                >
                    <img
                        src="favicon.ico"
                        alt="Kuchařka"
                        width="32"
                        height="32"
                        className="rounded app-navbar-logo"
                    />
                    <span>Home</span>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

const Navbar = ReactBootstrap.Navbar;
const Container = ReactBootstrap.Container;