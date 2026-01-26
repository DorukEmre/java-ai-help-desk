package dev.dorukemre.ticketservice.request;

import java.util.List;

import dev.dorukemre.ticketservice.entity.TicketAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateTicketRequest {

  private String status;

  private String agentId;

  private List<TicketAction> actions;

  private List<String> tags;
}
