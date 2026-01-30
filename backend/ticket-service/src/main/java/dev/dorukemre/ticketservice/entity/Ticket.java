package dev.dorukemre.ticketservice.entity;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "tickets")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Ticket {

  @Id
  private String id;

  @NotNull(message = "User ID cannot be null")
  private String userId;

  @NotBlank(message = "Description cannot be blank")
  @Size(max = 255, message = "Description cannot exceed 255 characters")
  private String description;

  @NotBlank(message = "Status cannot be blank")
  @Builder.Default
  private String status = "OPEN";

  @CreatedDate
  private Instant createdAt;

  @LastModifiedDate
  private Instant updatedAt;

  private String agentId;

  private List<TicketAction> actions;

  private List<String> tags;

  private String cloudinaryPublicId;

  // @DBRef // To map to User entity instead of using userId
  // private User user;

}
