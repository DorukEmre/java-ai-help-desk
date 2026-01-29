import type { ReactNode } from "react";
import { Link } from "react-router-dom"

import { Accordion, Badge, ListGroup } from "react-bootstrap"

import type { Ticket } from "@/types/ticket"


type Props = {
  header: ReactNode;
  tickets: Ticket[];
}

export const TicketListAccordion = ({ header, tickets }: Props) => {

  return (
    <>

      <Accordion.Header>
        {header}
      </Accordion.Header>

      <Accordion.Body style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        {tickets.length > 0 ? (
          <ListGroup as="ul">
            {tickets.map((ticket) => (
              <ListGroup.Item as="li" key={ticket.id}
                className="d-flex flex-column justify-content-between align-items-start gap-2"
              >
                {/* status + date */}
                <div
                  className="d-flex flex-row justify-content-between align-items-center gap-2 w-100"
                  style={{ minWidth: "145px" }}
                >
                  <div className="">
                    <small>{new Date(ticket.createdAt).toLocaleString()}</small>
                  </div>

                  <Badge
                    bg="secondary"
                    className=""
                  >
                    {ticket.status.toLocaleLowerCase()}
                  </Badge>
                </div>

                {/* description */}
                <div className="">
                  <Link className="fw-bold text-body" to={`/tickets/${ticket.id}`}>
                    {ticket.description.split(' ').length > 10
                      ? `${ticket.description.split(' ').slice(0, 10).join(' ')}...`
                      : ticket.description}
                  </Link>
                </div>

              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No tickets.</p>
        )}
      </Accordion.Body>
    </>
  )
}