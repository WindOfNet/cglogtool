import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Routes, Route, Outlet, Link, Navigate } from 'react-router-dom';
import FreeSearch from './pages/FreeSearch';
import Theft from './pages/Theft';
import Tree from './pages/Tree';
import HappinessMatches2022 from './pages/HappinessMatches2022';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import '@fortawesome/fontawesome-free/css/solid.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<FreeSearch />} />
        <Route path="theft" element={<Theft />} />
        <Route path="tree" element={<Tree />} />
        <Route
          path="happiness-matches-2022"
          element={<HappinessMatches2022 />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
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
            <Nav.Link as={Link} to="/theft">
              偷竊
            </Nav.Link>
            <Nav.Link as={Link} to="/tree">
              改樹
            </Nav.Link>
            <Nav.Link as={Link} to="/happiness-matches-2022">
              幸福火柴棒[2022]
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link
              as="a"
              target="__blank"
              href="https://github.com/WindOfNet/cglogtool"
            >
              <i className="fa-brands fa-github"></i>
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
