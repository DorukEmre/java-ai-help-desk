import type { TicketCreationResponse } from "@/types/ticket";
import { Badge, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

type Props = {
  ticket: TicketCreationResponse;
  resetTicket: () => void;
}

export const TicketCreateSuccess = ({ ticket, resetTicket }: Props) => {

  return (

    <Container>
      <div className="d-flex justify-content-between align-items-center mx-auto mb-4" style={{ maxWidth: '400px' }}>
        <p>Ticket successfully created</p>
        <Button variant="primary" type="button" onClick={resetTicket}>
          New Ticket
        </Button>
      </div>
      <div className="border border-secondary p-2 rounded d-flex justify-content-between align-items-start">

        <div className="ms-2 me-auto">
          <Link className="fw-bold text-body d-block" to={`/tickets/${ticket.id}`}>
            {ticket.description}
          </Link>
        </div>

        <div className="text-end">
          <Badge bg="secondary" className="mb-1">{ticket.status.toLocaleLowerCase()}</Badge>
          <div>
            <small>{new Date(ticket.createdAt).toLocaleString()}</small>
          </div>
        </div>

      </div>
    </Container >
  )
}
