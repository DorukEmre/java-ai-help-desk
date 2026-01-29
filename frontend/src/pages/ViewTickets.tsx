import { useEffect, useState } from "react";
import axios from "axios";

import { Tab, Tabs } from "react-bootstrap";

import { TicketList } from "@/components/TicketList";
import { ErrorMessage } from "@/components/ErrorMessage";

import { useAuth } from "@/auth/useAuth";
import { useAuthApi } from "@/hooks/useAuthApi";
import type { Ticket } from "@/types/ticket";


const ViewTickets = () => {

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const authApi = useAuthApi();


  useEffect(() => {

    const getTickets = async (url: string) => {
      setIsLoading(true);

      try {

        const response = await authApi.get(url,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },);
        console.log("Response.data:", response.data);

        setTickets(response.data);

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
        setIsLoading(false);
      }
    }
    let url: string;

    if (user?.role == "STANDARD_USER")
      url = `/users/${user?.id}/tickets`;
    else
      url = `/tickets`;

    getTickets(url);

  }, [authApi, user?.id, user?.role]);

  return (
    <>
      <h1 className="visually-hidden">View Tickets</h1>

      <ErrorMessage error={error} />

      {(user?.role == "STANDARD_USER") ? (
        <TicketList
          tickets={tickets}
          isLoading={isLoading}
        />
      ) : (

        <Tabs
          defaultActiveKey="my"
          id="view-tickets"
          className="mb-3 mx-auto"
        >
          <Tab eventKey="my" title="My tickets">
            <TicketList
              tickets={tickets.filter(ticket => ticket.agentId == user?.id)}
              isLoading={isLoading}
            />
          </Tab>
          <Tab eventKey="unassigned" title="Unassigned tickets">
            <TicketList
              tickets={tickets.filter(ticket => ticket.agentId == null || ticket.agentId === undefined)}
              isLoading={isLoading}
            />
          </Tab>
        </Tabs>
      )}

    </>
  );
}

export default ViewTickets
