import type { User } from "@/types/auth";
import { useState } from "react";
import { InputGroup, Form, Button, ListGroup } from "react-bootstrap";


interface Props {
  agents: User[];
  currentStatus: string;
  currentAgentId?: string;
  onUpdate: (status: string, agentId?: string) => void;
}

export const TicketAssignment = ({ agents, currentStatus, currentAgentId, onUpdate }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [selectedAgent, setSelectedAgent] = useState(currentAgentId || "");

  const handleUpdate = () => {
    onUpdate(selectedStatus, selectedAgent || undefined);
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
            <option value="">Select status...</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </Form.Select>
          <Button variant="outline-secondary" onClick={handleUpdate}>
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
          <Button variant="outline-secondary" onClick={handleUpdate}>
            Assign Agent
          </Button>
        </InputGroup>
      </ListGroup.Item>
    </>
  );
};
