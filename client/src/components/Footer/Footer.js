// reactstrap components
import { Container, Nav, NavItem, NavLink } from "reactstrap";

function Footer() {
  return (
    <footer className="footer">
      <Container fluid>
        <Nav>
          <NavItem>
            <NavLink href="https://www.fixant.com">
              Budgeting System
            </NavLink>
          </NavItem>

        </Nav>
        <div className="copyright">
          © {new Date().getFullYear()}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
