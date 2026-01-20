package dev.dorukemre.userservice.response;

import dev.dorukemre.userservice.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {

  @NotBlank(message = "User ID cannot be blank")
  private String id;

  @NotBlank(message = "Username cannot be blank")
  private String username;

  @NotBlank(message = "Fullname cannot be blank")
  private String fullname;

  @NotNull(message = "Role cannot be null")
  private Role role;

  @NotBlank(message = "Access token cannot be blank")
  private String accessToken; // JWT token
}
