import { useEffect, useState } from "react";

import { InputGroup, Form, Button, ListGroup } from "react-bootstrap";

import type { User } from "@/types/auth";


interface Props {
  currentStatus: string;
  handleUpdateStatus: (newStatus: string) => void;
  agents: User[];
  currentAgentId?: string;
  handleUpdateAgentId: (newAgentId?: string) => void;
}

export const TicketAssignment = ({ currentStatus, handleUpdateStatus, agents, currentAgentId, handleUpdateAgentId }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [selectedAgent, setSelectedAgent] = useState(currentAgentId || "");

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

      <ListGroup.Item as="li">
        <InputGroup className="d-flex align-items-center">
          <strong>Status:</strong>{" "}
          <Form.Select
            className="ms-auto"
            style={{ maxWidth: "250px" }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </Form.Select>
          <Button variant="outline-secondary" onClick={onUpdateStatus}>
            Update Status
          </Button>
        </InputGroup>
      </ListGroup.Item>

      {/* Agent selector */}
      <ListGroup.Item as="li">
        <InputGroup className="d-flex align-items-center">
          <strong>Assigned Agent:</strong>{" "}
          <Form.Select
            className="ms-auto"
            style={{ maxWidth: "250px" }}
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
          <Button variant="outline-secondary" onClick={onUpdateAgentId}>
            Assign Agent
          </Button>
        </InputGroup>
      </ListGroup.Item>
    </>
  );
};
