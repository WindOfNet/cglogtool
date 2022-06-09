import { Container, Navbar, Nav } from "react-bootstrap";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import FreeSearch from "./pages/FreeSearch";
import MouseBooty from "./pages/MouseBooty";
import MeiShiang from "./pages/MeiShiang";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<FreeSearch />} />
        <Route path="mousebooty" element={<MouseBooty />} />
        <Route path="meishiang" element={<MeiShiang />} />
      </Route>
    </Routes>
  );
};

const Layout = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            魔力寶貝日誌工具
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              自定義檢索
            </Nav.Link>
            <Nav.Link as={Link} to="/mousebooty">
              遊行禮盒
            </Nav.Link>
            <Nav.Link as={Link} to="/meishiang">
              梅香的心意
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <main style={{ padding: 20 }}>
          <Outlet />
        </main>
      </Container>
    </>
  );
};

export default App;
