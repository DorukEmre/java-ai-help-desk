import { useEffect, useState } from "react";

import { InputGroup, Form, ListGroup } from "react-bootstrap";

import { RequestButton } from "@/components/RequestButton";

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
      <ListGroup.Item as="li"
        className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center"
      >
        <p className="fw-bold mb-1 mb-sm-0">Status:</p>

        <InputGroup className="d-flex align-items-center w-auto">

          <Form.Select
            className="ms-auto"
            style={{ minWidth: "150px", maxWidth: "250px" }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </Form.Select>

          <RequestButton
            variant="outline-secondary"
            onClick={onUpdateStatus}
            disabled={anyLoading}
            isLoading={isLoading.isUpdatingStatus}
            style={{ width: "105px" }}
          >
            Update
          </RequestButton>

        </InputGroup>
      </ListGroup.Item>

      {/* Agent selector */}
      <ListGroup.Item as="li"
        className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center"
      >
        <p className="fw-bold mb-1 mb-sm-0">Assigned Agent:</p>

        <InputGroup className="d-flex align-items-center w-auto">

          <Form.Select
            className="ms-auto"
            style={{ minWidth: "150px", maxWidth: "250px" }}
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

          <RequestButton
            variant="outline-secondary"
            onClick={onUpdateAgentId}
            disabled={anyLoading}
            isLoading={isLoading.isUpdatingAgent}
            style={{ width: "105px" }}
          >
            Assign
          </RequestButton>

        </InputGroup>
      </ListGroup.Item>
    </>
  );
};
