import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import Header from '@/components/Header';

import HomePage from '@/pages/HomePage';
import Page404 from "@/pages/Page404";
import Login from "@/pages/Login";

function App() {

  return (
    <Container fluid className="d-flex flex-column min-vh-100 bg-back-300 text-neutral-300 p-0 position-relative">
      <Header />

      <main className="flex-fill p-5">
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />

          {/* 404 / Fallback */}
          <Route path="*" element={<Page404 />} />

        </Routes>
      </main>

    </Container>
  )
}

export default App
