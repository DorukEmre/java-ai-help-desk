import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { ListGroup, Spinner } from "react-bootstrap";

import { AdvancedImage, placeholder, responsive } from "@cloudinary/react";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { cloudinary } from "@/config/cloudinaryConfig";

import { TicketAssignment } from "@/components/TicketAssignment";
import { TicketDetailsInfoItem } from "@/components/TicketDetailsInfoItem";
import { ErrorMessage } from "@/components/ErrorMessage";
import { DateFormatter } from "@/components/DateFormatter";

import { useAuth } from "@/auth/useAuth";
import { useAuthApi } from "@/hooks/useAuthApi";

import type { User } from "@/types/auth";
import type { Ticket, TicketLoadingState, TicketField, UpdateTicketRequest } from "@/types/ticket";


const ViewTicketDetails = () => {
  const { ticketId } = useParams<{ ticketId: string }>();

  const location = useLocation();
  const passedTicket = location.state?.ticket as Ticket | undefined;

  const [error, setError] = useState<unknown>(null);
  const [ticket, setTicket] = useState<Ticket | null>(passedTicket ?? null);
  const [agents, setAgents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<TicketLoadingState>({
    isLoadingAgentsList: false,
    isLoadingTicket: false,
    isUpdatingStatus: false,
    isUpdatingAgent: false,
    isUpdatingTags: false,
    isUpdatingActions: false
  });

  const { user } = useAuth();
  const authApi = useAuthApi();


  useEffect(() => {

    const getAgentsList = async () => {
      setIsLoading(prevState => ({ ...prevState, isLoadingAgentsList: true, }));

      try {

        const url = `/users?role=AGENT`;

        const response = await authApi.get(url);
        console.debug("getAgentsList:", response.data);

        setAgents(response.data);

      } catch (error) {
        setError(error);
        console.error("Unexpected error:", error);

      } finally {
        setIsLoading(prevState => ({ ...prevState, isLoadingAgentsList: false, }));
      }
    }

    if (user?.role == "AGENT" || user?.role == "ADMIN")
      getAgentsList();

  }, [authApi, user?.role]);

  useEffect(() => {

    const getTicket = async () => {
      setIsLoading(prevState => ({ ...prevState, isLoadingTicket: true, }));

      try {

        const url = `/tickets/${ticketId}`;

        const response = await authApi.get(url);
        console.debug("getTicket:", response.data);

        setTicket(response.data);

      } catch (error) {
        setError(error);
        console.error("Unexpected error:", error);

      } finally {
        setIsLoading(prevState => ({ ...prevState, isLoadingTicket: false, }));
      }
    }
    getTicket();

  }, [authApi, ticketId]);

  const loadingFieldMap: Record<TicketField, string> = {
    status: 'isUpdatingStatus',
    agentId: 'isUpdatingAgent',
    tags: 'isUpdatingTags',
    actions: 'isUpdatingActions',
  };

  const updateTicket = async (field: TicketField, body: UpdateTicketRequest) => {
    console.debug("Updating ticket:", { field, body });

    setError(null);

    const loadingKey = loadingFieldMap[field];
    if (loadingKey) {
      setIsLoading(prevState => ({
        ...prevState,
        [loadingKey]: true,
      }));
    }

    try {

      const url = `/tickets/${ticketId}?update=${field}`;

      const response = await authApi.patch(url, body);
      console.debug("Updated ticket:", response.data);

      setTicket(response.data);

    } catch (error) {
      setError(error);
      console.error("Unexpected error:", error);

    } finally {
      if (loadingKey) {
        setIsLoading(prevState => ({
          ...prevState,
          [loadingKey]: false,
        }));
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

      <ErrorMessage error={error} />

      {ticket
        && !(isLoading.isLoadingTicket || isLoading.isLoadingAgentsList)
        ? (
          <ListGroup as="ul" className="mx-auto">

            <TicketDetailsInfoItem
              label="Description:"
              value={<div style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</div>}
              noFlex
            />

            {(user?.role == "AGENT" || user?.role == "ADMIN") ? (
              <TicketAssignment
                currentStatus={ticket.status}
                handleUpdateStatus={handleUpdateStatus}
                agents={agents}
                currentAgentId={ticket.agentId || ""}
                handleUpdateAgentId={handleUpdateAgentId}
                isLoading={isLoading}
              />
            ) : (
              <>
                <TicketDetailsInfoItem
                  label="Status:"
                  value={ticket.status.toLocaleLowerCase()}
                />
                <TicketDetailsInfoItem
                  label="Assigned Agent:"
                  value={ticket.agentId ?? "Unassigned"}
                />
              </>
            )}

            <TicketDetailsInfoItem
              label="Created At:"
              value={<DateFormatter
                date={ticket.createdAt}
                noWrapper
              />}
            />

            <TicketDetailsInfoItem
              label="Last Updated:"
              value={<DateFormatter
                date={ticket.updatedAt}
                noWrapper
              />}
            />

            <TicketDetailsInfoItem
              label="Created By (User ID):"
              value={ticket.userId}
            />

            <TicketDetailsInfoItem
              style={ticket.cloudinaryPublicId ? { height: "200px" } : {}}
              label="Image:"
              value={ticket.cloudinaryPublicId && (
                <AdvancedImage
                  className="rounded h-100"
                  style={{ maxHeight: '100%' }}
                  cldImg={cloudinary.image(ticket.cloudinaryPublicId).resize(scale().height(200))}
                  plugins={[responsive(), placeholder()]}
                />
              )}
              noWrapper
            />

            <TicketDetailsInfoItem
              label="Tags:"
              value={ticket.tags && ticket.tags.length > 0
                ? ticket.tags.join(", ")
                : "None"}
            />

            <TicketDetailsInfoItem
              label="Actions:"
              value={ticket.actions && ticket.actions.length > 0 ? (
                <ListGroup as="ul" className="mt-2">
                  {ticket.actions.map((action, index) => (
                    <ListGroup.Item as="li" key={index}>
                      <div>
                        <p className="fw-bold">Type:</p> {action.type}
                      </div>
                      <div>
                        <p className="fw-bold">Performed By:</p> {action.performedBy}
                      </div>
                      <div>
                        <p className="fw-bold">At:</p>{" "}
                        <DateFormatter
                          date={action.timestamp}
                          noWrapper
                        />
                      </div>
                      <div>
                        <p className="fw-bold">Details:</p> {action.details}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div>No actions recorded</div>
              )}
              noWrapper
            />

          </ListGroup>
        ) : (
          <>
            <span >Loading... </span>
            <Spinner animation="border" size="sm" role="status" />
          </>
        )}
    </>
  );

};

export default ViewTicketDetails