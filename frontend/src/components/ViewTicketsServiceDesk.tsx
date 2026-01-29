import { useMemo } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { TicketList } from "@/components/TicketList";
import type { Ticket } from "@/types/ticket";

interface Props {
  tickets: Ticket[];
  userId: string;
  isLoading: boolean;
}

const ViewTicketsServiceDesk = ({ tickets, userId, isLoading }: Props) => {

  const myTickets = useMemo(
    () => tickets.filter(ticket => ticket.agentId === userId),
    [tickets, userId]
  );

  const unassignedTickets = useMemo(
    () => tickets.filter(ticket => ticket.agentId == null),
    [tickets]
  );

  return (
    <Tabs
      defaultActiveKey="my"
      id="view-tickets"
      className="mb-3 mx-auto"
    >

      <Tab eventKey="my" title="My tickets">
        <TicketList
          tickets={myTickets}
          isLoading={isLoading}
        />
      </Tab>

      <Tab eventKey="unassigned" title="Unassigned tickets">
        <TicketList
          tickets={unassignedTickets}
          isLoading={isLoading}
        />
      </Tab>

    </Tabs>
  );
};

export default ViewTicketsServiceDesk;
