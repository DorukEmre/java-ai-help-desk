import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ListGroup, Spinner } from "react-bootstrap";

import { AdvancedImage, placeholder, responsive } from "@cloudinary/react";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { cloudinary } from "@/config/cloudinaryConfig";

import { TicketAssignment } from "@/components/TicketAssignment";
import { Error } from "@/components/Error";

import { useAuth } from "@/auth/useAuth";
import { useAuthApi } from "@/hooks/useAuthApi";

import type { User } from "@/types/auth";
import type { Ticket, TicketLoadingState, TicketField, UpdateTicketRequest } from "@/types/ticket";


const ViewTicketDetails = () => {
  const { ticketId } = useParams<{ ticketId: string }>();

  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
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
      } finally {
        setIsLoading(prevState => ({ ...prevState, isLoadingAgentsList: false, }));
      }
    }

    if (user?.role == "SERVICE_DESK_USER" || user?.role == "ADMIN")
      getAgentsList();

  }, [authApi, user?.role]);

  useEffect(() => {

    const getTicket = async () => {
      setIsLoading(prevState => ({ ...prevState, isLoadingTicket: true, }));

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
    console.log("Updating ticket:", { field, body });

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

      <Error error={error} />

      {ticket
        && !(isLoading.isLoadingTicket || isLoading.isLoadingAgentsList)
        ? (
          <ListGroup as="ul" className="mx-auto" style={{ maxWidth: "800px" }}>

            <ListGroup.Item as="li" className="">
              <p className="fw-bold">Description:</p>
              <div>{ticket.description}</div>
            </ListGroup.Item>

            {(user?.role == "SERVICE_DESK_USER" || user?.role == "ADMIN") ? (
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
                <ListGroup.Item as="li" className="d-flex justify-content-between flex-wrap">
                  <p className="fw-bold">Status:</p> {ticket.status.toLocaleLowerCase()}
                </ListGroup.Item>
                <ListGroup.Item as="li" className="d-flex justify-content-between flex-wrap">
                  <p className="fw-bold">Assigned Agent:</p>{" "}
                  {ticket.agentId ?? "Unassigned"}
                </ListGroup.Item>
              </>
            )}

            <ListGroup.Item as="li" className="d-flex justify-content-between flex-wrap">
              <p className="fw-bold">Created At:</p>{" "}
              {new Date(ticket.createdAt).toLocaleString()}
            </ListGroup.Item>

            <ListGroup.Item as="li" className="d-flex justify-content-between flex-wrap">
              <p className="fw-bold">Last Updated:</p>{" "}
              {new Date(ticket.updatedAt).toLocaleString()}
            </ListGroup.Item>

            <ListGroup.Item as="li" className="d-flex justify-content-between flex-wrap">
              <p className="fw-bold">Created By (User ID):</p> {ticket.userId}
            </ListGroup.Item>


            <ListGroup.Item as="li" className="d-flex justify-content-between flex-wrap"
              style={ticket.cloudinaryPublicId ? { height: "200px" } : {}}             >
              <p className="fw-bold">Image:</p>{" "}
              {ticket.cloudinaryPublicId && (
                <AdvancedImage
                  className="rounded h-100"
                  style={{ maxHeight: '100%' }}
                  cldImg={cloudinary.image(ticket.cloudinaryPublicId).resize(scale().height(200))}
                  plugins={[responsive(), placeholder()]}
                />
              )}
            </ListGroup.Item>

            <ListGroup.Item as="li" className="d-flex justify-content-between flex-wrap">
              <p className="fw-bold">Tags:</p>{" "}
              {ticket.tags && ticket.tags.length > 0
                ? ticket.tags.join(", ")
                : "None"}
            </ListGroup.Item>

            <ListGroup.Item as="li">
              <p className="fw-bold">Actions:</p>

              {ticket.actions && ticket.actions.length > 0 ? (
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
                        {new Date(action.timestamp).toLocaleString()}
                      </div>
                      <div>
                        <p className="fw-bold">Details:</p> {action.details}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="mt-1">No actions recorded</div>
              )}
            </ListGroup.Item>

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