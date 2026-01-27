package dev.dorukemre.ticketservice.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketCreationRequest {

  @NotBlank(message = "Description is required")
  private String description;

  private String cloudinaryIdPublicId;

}
