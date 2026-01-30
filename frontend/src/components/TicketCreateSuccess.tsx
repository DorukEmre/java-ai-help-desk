import { Button, Container } from "react-bootstrap";

import { TicketListItem } from "@/components/TicketListItem";

import type { TicketCreationResponse } from "@/types/ticket";


type Props = {
  ticket: TicketCreationResponse;
  resetTicket: () => void;
}

export const TicketCreateSuccess = ({ ticket, resetTicket }: Props) => {

  return (

    <Container>

      {/* header */}
      <div className="d-flex justify-content-between align-items-center mx-auto mb-4" style={{ maxWidth: '400px' }}>
        <p>Ticket successfully created</p>
        <Button variant="primary" type="button" onClick={resetTicket}>
          New Ticket
        </Button>
      </div>

      {/* newly created ticket */}
      <div className="ticket-list-item rounded border border-secondary">

        <TicketListItem
          ticket={ticket}
        />

      </div>

    </Container >
  )
}
