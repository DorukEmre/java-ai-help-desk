
export type TicketActionType =
  | "CREATED"
  | "ASSIGNED"
  | "STATUS_CHANGED"
  | "COMMENT_ADDED"
  | "RESOLVED";


export interface TicketAction {
  type: TicketActionType;
  performedBy: string;
  details: string;
  timestamp: string;
}


export interface TicketCreationResponse {
  id: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface UpdateTicketRequest {
  status?: string;
  agentId?: string | null;
  actions?: TicketAction[];
  tags?: string[];
}

export interface Ticket {
  id: string;
  userId: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  agentId?: string | null;
  actions?: TicketAction[];
  tags?: string[];
}
