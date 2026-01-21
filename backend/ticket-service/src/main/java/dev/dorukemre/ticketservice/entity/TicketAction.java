package dev.dorukemre.ticketservice.entity;

import java.time.Instant;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TicketAction {
  private TicketActionType type;
  private String performedBy;
  private String details;
  private Instant timestamp;
}
