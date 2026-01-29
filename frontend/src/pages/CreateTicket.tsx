import { useState } from "react";

import { ErrorMessage } from "@/components/ErrorMessage";

import type { TicketCreationResponse } from "@/types/ticket";
import { TicketCreateSuccess } from "@/components/TicketCreateSuccess";
import { TicketCreateForm } from "@/components/TicketCreateForm";

const CreateTicket = () => {

  const [ticket, setTicket] = useState<TicketCreationResponse | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const resetTicket = () => {
    setTicket(null);
    setError(null);
    setResetKey(prev => prev + 1);
  };


  return (
    <>
      <h1 className="visually-hidden">Create Ticket</h1>

      <ErrorMessage error={error} />

      {ticket ? (

        // Show ticket after successful creation
        <TicketCreateSuccess
          ticket={ticket}
          resetTicket={resetTicket}
        />

      ) : (

        // Show form to create ticket
        <TicketCreateForm
          setTicket={setTicket}
          setError={setError}
          resetKey={resetKey}
        />

      )}

    </>
  );
}

export default CreateTicket
