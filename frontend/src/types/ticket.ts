
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
  cloudinaryIdPublicId?: string | null;
}

export interface TicketCreationRequest {
  description: string;
  cloudinaryIdPublicId?: string | null;
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

export type TicketLoadingState = {
  isLoadingAgentsList: boolean;
  isLoadingTicket: boolean;
  isUpdatingStatus: boolean;
  isUpdatingAgent: boolean;
  isUpdatingTags: boolean;
  isUpdatingActions: boolean;
};

export type TicketField = 'status' | 'agentId' | 'tags' | 'actions';
