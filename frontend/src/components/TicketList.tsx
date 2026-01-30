import { Accordion, Col, Spinner } from "react-bootstrap"

import type { Ticket } from "@/types/ticket"
import { TicketListAccordion } from "./TicketListAccordion";

interface Props {
  tickets: Ticket[];
  isLoading: boolean;
  noTabs?: boolean;
}

export const TicketList = ({ tickets, isLoading, noTabs = false }: Props) => {

  const activeTickets = tickets.filter(ticket => ticket.status.toUpperCase() != 'CLOSED');
  const closedTickets = tickets.filter(ticket => ticket.status.toUpperCase() === 'CLOSED');

  return (
    <>
      {isLoading && (
        <>
          <span >Loading... </span>
          <Spinner animation="border" size="sm" role="status" />
        </>
      )}

      {!isLoading && tickets.length == 0 && (
        <>
          <p>No tickets found.</p>
        </>
      )}

      {!isLoading && tickets.length > 0 && (
        <Accordion as={Col} defaultActiveKey={['0']} alwaysOpen flush
          className={`mx-auto ${noTabs ? 'no-tabs' : ''}`}>

          <Accordion.Item eventKey="0">

            <TicketListAccordion
              header={`Active Tickets (${activeTickets.length})`}
              tickets={activeTickets}
            />

          </Accordion.Item>

          <Accordion.Item eventKey="1">

            <TicketListAccordion
              header={`Closed Tickets (${closedTickets.length})`}
              tickets={closedTickets}
            />

          </Accordion.Item>

        </Accordion>
      )}

    </>
  )
}