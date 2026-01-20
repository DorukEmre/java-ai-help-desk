package dev.dorukemre.userservice.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequest {

  @NotBlank(message = "Username cannot be blank")
  @Size(max = 30, message = "Fullname cannot exceed 30 characters")
  private String username;

  @NotBlank(message = "Fullname cannot be blank")
  @Size(max = 50, message = "Fullname cannot exceed 50 characters")
  private String fullname;

  @NotBlank(message = "Password cannot be blank")
  @Size(min = 6, message = "Password must be at least 6 characters long")
  @Size(max = 50, message = "Password cannot exceed 50 characters")
  @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "Password must contain at least one lowercase letter, one uppercase letter, and one number")
  private String password;

  @NotNull(message = "Role cannot be null")
  private String role;
}
