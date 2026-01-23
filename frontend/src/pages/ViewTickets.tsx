import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Badge, ListGroup } from "react-bootstrap";

import { useAuth } from "@/auth/useAuth";
import { useAuthApi } from "@/hooks/useAuthApi";
import type { Ticket } from "@/types/ticket";


const ViewTickets = () => {

  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const { user } = useAuth();
  const authApi = useAuthApi();


  useEffect(() => {

    const getTickets = async (url: string) => {

      try {

        const response = await authApi.get(url,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },);
        console.log("Response.data:", response.data);

        setTickets(response.data);

      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("Unexpected error:", error);
          if (error.response.data.message)
            setError(error.response.data.message);
          else if (error.response.status)
            setError("Unexpected error: " + error.response.status.toString());
          else
            setError('An unexpected error occurred.');

        } else {
          setError('An unexpected error occurred.');
          console.error("Unexpected error:", error);
        }
      }
    }
    let url: string;

    if (user?.role == "STANDARD_USER")
      url = `/users/${user?.id}/tickets`;
    else
      url = `/tickets`;

    getTickets(url);

  }, [authApi, user?.id, user?.role]);

  return (
    <>
      <h1 className="visually-hidden">View Tickets</h1>

      {error && <p className="text-danger">{error}</p>}

      {tickets.length > 0 ? (
        <ListGroup as="ul">

          {tickets.map((ticket) => (
            <ListGroup.Item as="li" key={ticket.id} className="d-flex justify-content-between align-items-start">

              <div className="ms-2 me-auto">
                <Link className="fw-bold text-body d-block" to={`/tickets/${ticket.id}`}>
                  {ticket.description}
                </Link>
                {/* <small>User ID: {ticket.userId}</small> */}
              </div>

              <div className="text-end">
                <Badge bg="secondary" className="mb-1">{ticket.status}</Badge>
                <div>
                  <small>{new Date(ticket.createdAt).toLocaleString()}</small>
                </div>
              </div>

            </ListGroup.Item>
          ))}

        </ListGroup>
      ) : (
        <p>No tickets found.</p>
      )}

    </>
  );
}

export default ViewTickets
