import { useQuery } from "@tanstack/react-query";

import { ErrorMessage } from "@/components/ErrorMessage";

import { useAuth } from "@/auth/useAuth";
import { useAuthApi } from "@/hooks/useAuthApi";
import type { Ticket } from "@/types/ticket";
import ViewTicketsStandard from "@/components/ViewTicketsStandard";
import ViewTicketsServiceDesk from "@/components/ViewTicketsServiceDesk";


const ViewTickets = () => {

  const { user } = useAuth();
  const authApi = useAuthApi();

  const {
    data: tickets,
    error,
    isLoading,
  } = useQuery<Ticket[], Error>({
    queryKey: ["tickets", user?.id, user?.role],
    queryFn: async () => {

      const url =
        user?.role === "STANDARD_USER"
          ? `/users/${user.id}/tickets`
          : `/tickets`;

      const response = await authApi.get<Ticket[]>(url);
      return response.data;
    },
    enabled: Boolean(user?.id),
  });

  const safeTickets: Ticket[] = tickets ?? [];

  return (
    <>
      <h1 className="visually-hidden">View Tickets</h1>

      <ErrorMessage error={error} />

      {(user?.role == "STANDARD_USER") ? (

        <ViewTicketsStandard
          tickets={safeTickets}
          isLoading={isLoading}
        />

      ) : (

        <ViewTicketsServiceDesk
          tickets={safeTickets}
          userId={user?.id!}
          isLoading={isLoading}
        />

      )}
    </>
  );
}

export default ViewTickets
