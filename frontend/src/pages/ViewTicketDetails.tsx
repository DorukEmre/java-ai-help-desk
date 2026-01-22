import { useParams } from "react-router-dom";

const ViewTicketDetails = () => {
  const { ticketId } = useParams<{ ticketId: string }>();

  return (
    <>
      <h1 className="visually-hidden">Ticket Detail</h1>

      <div>Ticket ID: {ticketId}</div>
    </>
  );
};

export default ViewTicketDetails