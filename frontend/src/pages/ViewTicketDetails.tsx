import { useAuth } from "@/auth/useAuth";
import { TicketAssignment } from "@/components/TicketAssignment";
import { useAuthApi } from "@/hooks/useAuthApi";
import type { User } from "@/types/auth";
import type { Ticket, UpdateTicketRequest } from "@/types/ticket";
import axios from "axios";
import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ViewTicketDetails = () => {
  const { ticketId } = useParams<{ ticketId: string }>();

  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [agents, setAgents] = useState<User[]>([]);

  const { user } = useAuth();
  const authApi = useAuthApi();


  useEffect(() => {

    const getAgentsList = async () => {

      try {

        const url = `/users?role=SERVICE_DESK_USER`;

        const response = await authApi.get(url);
        console.log("getAgentsList:", response.data);

        setAgents(response.data);

      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("Unexpected error:", error);
          if (error.response.data.message)
            setError(error.response.data.message);
          else if (error.response.status)
            setError("Unexpected error: " + error.response.status.toString());
          else
            setError('An unexpected error occurred.');

        } else {
          setError('An unexpected error occurred.');
          console.error("Unexpected error:", error);
        }
      }
    }

    if (user?.role == "SERVICE_DESK_USER" || user?.role == "ADMIN")
      getAgentsList();

  }, [authApi, user?.role]);

  useEffect(() => {

    const getTicket = async () => {

      try {

        const url = `/tickets/${ticketId}`;

        const response = await authApi.get(url);
        console.log("getTicket:", response.data);

        setTicket(response.data);

      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("Unexpected error:", error);
          if (error.response.data.message)
            setError(error.response.data.message);
          else if (error.response.status)
            setError("Unexpected error: " + error.response.status.toString());
          else
            setError('An unexpected error occurred.');

        } else {
          setError('An unexpected error occurred.');
          console.error("Unexpected error:", error);
        }
      }
    }
    getTicket();

  }, [authApi, ticketId]);

  const updateTicket = async (field: string, body: UpdateTicketRequest) => {
    console.log("Updating ticket:", { field, body });


    try {

      const url = `/tickets/${ticketId}?update=${field}`;

      const response = await authApi.patch(url, body);
      console.log("Updated ticket:", response.data);

      setTicket(response.data);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Unexpected error:", error);
        if (error.response.data.message)
          setError(error.response.data.message);
        else if (error.response.status)
          setError("Unexpected error: " + error.response.status.toString() + " " + error.code || "");
        else
          setError('An unexpected error occurred.');

      } else {
        setError('An unexpected error occurred.');
        console.error("Unexpected error:", error);
      }
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    await updateTicket("status", { status: newStatus });
  };
  const handleUpdateAgentId = async (newAgentId: string | undefined) => {
    await updateTicket("agentId", { agentId: newAgentId });
  };


  return (
    <>
      <h1 className="visually-hidden">Ticket Detail</h1>

      <div className="mb-3">
        <strong>Ticket ID:</strong> {ticketId}
      </div>

      {error && <p className="text-danger">{error}</p>}

      {ticket && (
        <ListGroup as="ul">

          <ListGroup.Item as="li">
            <strong>Description:</strong>
            <div>{ticket.description}</div>
          </ListGroup.Item>


          {(user?.role == "SERVICE_DESK_USER" || user?.role == "ADMIN") ? (
            <TicketAssignment
              currentStatus={ticket.status}
              handleUpdateStatus={handleUpdateStatus}
              agents={agents}
              currentAgentId={ticket.agentId || ""}
              handleUpdateAgentId={handleUpdateAgentId}
            />
          ) : (
            <>
              <ListGroup.Item as="li">
                <strong>Status:</strong> {ticket.status}
              </ListGroup.Item>
              <ListGroup.Item as="li">
                <strong>Assigned Agent:</strong>{" "}
                {ticket.agentId ?? "Unassigned"}
              </ListGroup.Item>
            </>
          )}

          <ListGroup.Item as="li">
            <strong>Created At:</strong>{" "}
            {new Date(ticket.createdAt).toLocaleString()}
          </ListGroup.Item>

          <ListGroup.Item as="li">
            <strong>Last Updated:</strong>{" "}
            {new Date(ticket.updatedAt).toLocaleString()}
          </ListGroup.Item>

          <ListGroup.Item as="li">
            <strong>Created By (User ID):</strong> {ticket.userId}
          </ListGroup.Item>


          <ListGroup.Item as="li">
            <strong>Tags:</strong>{" "}
            {ticket.tags && ticket.tags.length > 0
              ? ticket.tags.join(", ")
              : "None"}
          </ListGroup.Item>

          <ListGroup.Item as="li">
            <strong>Actions:</strong>

            {ticket.actions && ticket.actions.length > 0 ? (
              <ListGroup as="ul" className="mt-2">
                {ticket.actions.map((action, index) => (
                  <ListGroup.Item as="li" key={index}>
                    <div>
                      <strong>Type:</strong> {action.type}
                    </div>
                    <div>
                      <strong>Performed By:</strong> {action.performedBy}
                    </div>
                    <div>
                      <strong>At:</strong>{" "}
                      {new Date(action.timestamp).toLocaleString()}
                    </div>
                    <div>
                      <strong>Details:</strong> {action.details}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="mt-1">No actions recorded</div>
            )}
          </ListGroup.Item>

        </ListGroup>
      )}
    </>
  );

};

export default ViewTicketDetails