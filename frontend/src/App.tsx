import { Routes, Route, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

import ProtectedRoute from "@/components/ProtectedRoute";

import Header from '@/components/Header';

import HomePage from '@/pages/HomePage';
import Page404 from "@/pages/Page404";
import Login from "@/pages/Login";
import ViewTickets from "@/pages/ViewTickets";
import CreateTicket from "@/pages/CreateTicket";
import ViewTicketDetails from "@/pages/ViewTicketDetails";

function App() {

  return (
    <Container fluid className="d-flex flex-column min-vh-100 bg-back-300 text-neutral-300 p-0 position-relative">
      <Header />

      <main className="flex-fill p-5">
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>

            <Route path="/tickets/view" element={<ViewTickets />} />
            <Route path="/tickets/create" element={<CreateTicket />} />
            <Route path="/tickets/:ticketId" element={<ViewTicketDetails />} />

          </Route>

          {/* 404 - Fallback */}
          <Route path="*" element={<Page404 />} />

        </Routes>
      </main>

    </Container>
  )
}

export default App
