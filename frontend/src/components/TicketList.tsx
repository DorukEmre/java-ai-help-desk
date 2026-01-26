import { Link } from "react-router-dom";

import { Accordion, Badge, ListGroup } from "react-bootstrap"

import type { Ticket } from "@/types/ticket"

interface Props {
  tickets: Ticket[];
}

export const TicketList = ({ tickets }: Props) => {

  const activeTickets = tickets.filter(ticket => ticket.status.toUpperCase() != 'CLOSED');
  const closedTickets = tickets.filter(ticket => ticket.status.toUpperCase() === 'CLOSED');

  return (
    <>
      {tickets.length > 0 ? (
        <Accordion defaultActiveKey={['0']} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              Active Tickets ({activeTickets.length})
            </Accordion.Header>
            <Accordion.Body style={{ maxHeight: '50%', overflowY: 'scroll' }}>
              {activeTickets.length > 0 ? (
                <ListGroup as="ul">
                  {activeTickets.map((ticket) => (
                    <ListGroup.Item as="li" key={ticket.id} className="d-flex justify-content-between align-items-start">
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
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No tickets found.</p>
              )}
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>
              Closed Tickets ({closedTickets.length})
            </Accordion.Header>
            <Accordion.Body style={{ maxHeight: '50%', overflowY: 'scroll' }}>
              {closedTickets.length > 0 ? (
                <ListGroup as="ul">
                  {closedTickets.map((ticket) => (
                    <ListGroup.Item as="li" key={ticket.id} className="d-flex justify-content-between align-items-start">
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
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No tickets found.</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}