package dev.dorukemre.ticketservice.response;

import java.util.List;

import dev.dorukemre.ticketservice.entity.TicketAction;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketResponse {

  @NotBlank(message = "Description is required")
  private String description;

  @NotBlank(message = "Status is required")
  private String status;

  @NotBlank(message = "CreatedAt is required")
  private String createdAt;

  @NotBlank(message = "UpdatedAt is required")
  private String updatedAt;

  private String agentId;

  private List<TicketAction> actions;

}
