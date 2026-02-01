package dev.dorukemre.userservice.service.dto;

import dev.dorukemre.userservice.response.AuthResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResult {

  @NotEmpty(message = "AuthResponse cannot be empty")
  private AuthResponse authResponse;

  @NotBlank(message = "Refresh token cannot be blank")
  private String refreshToken;
}
