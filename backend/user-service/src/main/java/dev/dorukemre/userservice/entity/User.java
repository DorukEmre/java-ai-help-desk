package dev.dorukemre.userservice.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

  @Id
  private String id;

  @NotBlank(message = "Username cannot be blank")
  @Size(max = 30, message = "Username cannot exceed 30 characters")
  private String username;

  @NotBlank(message = "Fullname cannot be blank")
  @Size(max = 50, message = "Fullname cannot exceed 50 characters")
  private String fullname;

  @NotBlank(message = "Password cannot be blank")
  private String hashedPassword;

  @NotEmpty(message = "Role cannot be empty")
  private Role role;
}
