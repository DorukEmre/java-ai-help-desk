import { TicketList } from "@/components/TicketList";
import type { Ticket } from "@/types/ticket";

interface Props {
  tickets: Ticket[];
  isLoading: boolean;
}

const ViewTicketsStandard = ({ tickets, isLoading }: Props) => {

  return (

    <TicketList
      tickets={tickets}
      isLoading={isLoading}
    />

  );
};

export default ViewTicketsStandard;
