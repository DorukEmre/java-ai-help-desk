import { useEffect, useState } from "react";

import { InputGroup, Form, Button, ListGroup, Spinner } from "react-bootstrap";

import type { User } from "@/types/auth";
import type { TicketLoadingState } from "@/types/ticket";


interface Props {
  currentStatus: string;
  handleUpdateStatus: (newStatus: string) => void;
  agents: User[];
  currentAgentId?: string;
  handleUpdateAgentId: (newAgentId?: string) => void;
  isLoading: TicketLoadingState;
}

export const TicketAssignment = ({ currentStatus, handleUpdateStatus, agents, currentAgentId, handleUpdateAgentId, isLoading }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [selectedAgent, setSelectedAgent] = useState(currentAgentId || "");

  const anyLoading = Object.values(isLoading).some(loading => loading);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    setSelectedAgent(currentAgentId || "");
  }, [currentAgentId]);

  const onUpdateStatus = () => {
    handleUpdateStatus(selectedStatus);
  };

  const onUpdateAgentId = () => {
    handleUpdateAgentId(selectedAgent || undefined);
  };

  return (
    <>
      {/* Status selector */}

      <ListGroup.Item as="li" className="d-flex justify-content-between align-items-center flex-wrap">
        <p className="fw-bold">Status:</p>{" "}

        <InputGroup className="d-flex align-items-center w-auto">
          <Form.Select
            className="ms-auto"
            style={{ minWidth: "175px", maxWidth: "250px" }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </Form.Select>
          <Button variant="outline-secondary" onClick={onUpdateStatus} disabled={anyLoading} style={{ width: "75px" }}
          >
            Update{' '}
            {isLoading.isUpdatingStatus && (
              <>
                <Spinner as="span"
                  animation="border" size="sm" role="status" aria-hidden="true"
                />
                <span className="visually-hidden">Loading...</span>
              </>
            )}
          </Button>
        </InputGroup>
      </ListGroup.Item>

      {/* Agent selector */}
      <ListGroup.Item as="li" className="d-flex justify-content-between align-items-center flex-wrap">
        <p className="fw-bold">Assigned Agent:</p>{" "}

        <InputGroup className="d-flex align-items-center w-auto">
          <Form.Select
            className="ms-auto"
            style={{ minWidth: "175px", maxWidth: "250px" }}
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            <option value="">Unassigned</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.fullname}
              </option>
            ))}
          </Form.Select>
          <Button variant="outline-secondary" onClick={onUpdateAgentId} disabled={anyLoading} style={{ width: "75px" }}
          >
            Assign{' '}
            {isLoading.isUpdatingAgent && (
              <>
                <Spinner as="span"
                  animation="border" size="sm" role="status" aria-hidden="true"
                />
                <span className="visually-hidden">Loading...</span>
              </>
            )}
          </Button>
        </InputGroup>
      </ListGroup.Item>
    </>
  );
};
