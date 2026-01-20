package dev.dorukemre.ticketservice.response;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketCreationResponse {

  @NotBlank(message = "Description is required")
  private String description;

  @NotBlank(message = "Status is required")
  private String status;
}
