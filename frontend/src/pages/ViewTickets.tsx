import { useQuery } from "@tanstack/react-query";

import { ViewTicketsStandard } from "@/components/ViewTicketsStandard";
import { ViewTicketsAgent } from "@/components/ViewTicketsAgent";
import { RequestButton } from "@/components/RequestButton";
import { ErrorMessage } from "@/components/ErrorMessage";

import { useAuth } from "@/auth/useAuth";
import { useAuthApi } from "@/hooks/useAuthApi";

import type { Ticket } from "@/types/ticket";


const ViewTickets = () => {

  const { user } = useAuth();
  const authApi = useAuthApi();

  const {
    data: tickets,
    error, isLoading, refetch, isFetching,
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

      <div className="d-flex w-100">
        <RequestButton
          variant="secondary"
          onClick={() => refetch()}
          isLoading={isFetching}
          className="mb-4 ms-auto me-2 me-sm-0"
          style={{ width: "110px" }}
        >
          Refresh
        </RequestButton>
      </div>

      {(user?.role == "STANDARD_USER") ? (

        <ViewTicketsStandard
          tickets={safeTickets}
          isLoading={isLoading}
        />

      ) : (

        <ViewTicketsAgent
          tickets={safeTickets}
          userId={user?.id!}
          isLoading={isLoading}
        />

      )}
    </>
  );
}

export default ViewTickets
