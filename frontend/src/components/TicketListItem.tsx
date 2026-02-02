import { Link } from "react-router-dom"
import { Badge } from "react-bootstrap";

import { DateFormatter } from "@/components/DateFormatter";

import type { Ticket, TicketCreationResponse } from "@/types/ticket";


type Props = {
  ticket: Ticket | TicketCreationResponse;
  passInitialTicket?: boolean;
}

export const TicketListItem = ({ ticket, passInitialTicket = true }: Props) => {

  return (

    <Link
      to={`/tickets/${ticket.id}`}
      state={passInitialTicket ? { ticket } : undefined} className="ticket-list-item-link h-100 w-100 d-flex flex-column justify-content-between align-items-start gap-2 py-2 px-3"
    >

      {/* date + status */}
      < div
        className="d-flex flex-row justify-content-between align-items-center gap-2 w-100"
        style={{ minWidth: "145px" }}
      >
        <DateFormatter
          date={ticket.createdAt}
          className="text-body"
        />

        <Badge bg="secondary">
          {ticket.status.toLocaleLowerCase()}
        </Badge>
      </div>

      {/* description, max 10 words */}
      <p className="fw-bold text-body">
        {ticket.description.split(' ').length > 10
          ? `${ticket.description.split(' ').slice(0, 10).join(' ')}...`
          : ticket.description}
      </p>

    </Link>

  )
}