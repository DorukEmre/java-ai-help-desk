import type { ReactNode } from "react";

import { Accordion, ListGroup } from "react-bootstrap"

import { TicketListItem } from "@/components/TicketListItem";

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

      <Accordion.Body
        className="p-0"
        style={{ maxHeight: '300px', overflowY: 'scroll' }}
      >
        {tickets.length > 0 ? (
          <ListGroup as="ul" className="rounded-0">
            {tickets.map((ticket) => (
              <ListGroup.Item as="li" key={ticket.id}
                className="ticket-list-item p-0"
              >
                <TicketListItem
                  ticket={ticket}
                />

              </ListGroup.Item >
            ))}
          </ListGroup >
        ) : (
          <p className="py-2 px-3">No tickets.</p>
        )}
      </Accordion.Body >
    </>
  )
}