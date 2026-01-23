import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Badge, Button, Form } from "react-bootstrap";

import { useAuth } from "@/auth/useAuth";
import { useAuthApi } from "@/hooks/useAuthApi";
import type { TicketCreationResponse } from "@/types/ticket";

const CreateTicket = () => {
  const authApi = useAuthApi();
  const { user } = useAuth();

  const [description, setDescription] = useState<string>('');
  const [ticket, setTicket] = useState<TicketCreationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {

      const url = `/users/${user?.id}/tickets`;

      const response = await authApi.post(url,
        { description }
      );
      console.log("Ticket created:", response.data);

      setTicket(response.data);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred.');
        console.error("Unexpected error:", error);
      }
    }
  };

  const resetTicket = () => {
    setTicket(null);
    setDescription('');
    setError(null);
  };

  return (
    <>
      <h1 className="visually-hidden">Create Ticket</h1>

      {error && <p className="text-danger">{error}</p>}

      {ticket ? (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <p className="my-4">Ticket successfully created</p>
            <Button variant="primary" type="button" onClick={resetTicket}>
              New Ticket
            </Button>
          </div>
          <div className="d-flex justify-content-between align-items-start">

            <div className="ms-2 me-auto">
              <Link className="fw-bold text-body d-block" to={`/tickets/${ticket.id}`}>
                {ticket.description}
              </Link>
            </div>

            <div className="text-end">
              <Badge bg="secondary" className="mb-1">{ticket.status}</Badge>
              <div>
                <small>{new Date(ticket.createdAt).toLocaleString()}</small>
              </div>
            </div>

          </div>
        </>
      ) : (
        <Form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '366px' }}>
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required />
          </Form.Group>

          <Button variant="primary" type="submit">
            Create Ticket
          </Button>
        </Form>

      )}
    </>
  );
}

export default CreateTicket
