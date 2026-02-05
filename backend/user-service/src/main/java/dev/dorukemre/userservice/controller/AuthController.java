package dev.dorukemre.userservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.dorukemre.userservice.request.LoginRequest;
import dev.dorukemre.userservice.request.RegisterRequest;
import dev.dorukemre.userservice.response.AuthResponse;
import dev.dorukemre.userservice.security.RefreshTokenCookieManager;
import dev.dorukemre.userservice.service.AuthService;
import dev.dorukemre.userservice.service.dto.AuthResult;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class AuthController {

  private final AuthService authService;
  private final RefreshTokenCookieManager cookieManager;

  // @Operation(summary = "User Login", description = "Authenticates a user by
  // validating their credentials.")
  // @ApiResponses(value
  // = {
  // @ApiResponse(responseCode = "200", description = "Successful authentication",
  // content = @Content(mediaType = "application/json",
  // schema = @Schema(implementation = LoginResponse.class))),
  // @ApiResponse(responseCode = "401", description = "Invalid username or
  // password"),
  // @ApiResponse(responseCode = "400", description = "Bad request")
  // })
  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(
      @Valid @RequestBody LoginRequest request,
      HttpServletResponse response) {
    System.out.println("POST /api/v1/user/login called");

    AuthResult result = authService.login(request);

    cookieManager.addRefreshTokenCookie(response, result.getRefreshToken());

    return ResponseEntity.status(HttpStatus.OK).body(result.getAuthResponse());
  }

  // @Operation(summary = "User Registration", description = "Registers a new user
  // with provided account details.")
  // @ApiResponses(value = {
  // @ApiResponse(responseCode = "201", description = "User successfully
  // registered", content = @Content(mediaType = "application/json", schema =
  // @Schema(implementation = RegisterResponse.class))),
  // @ApiResponse(responseCode = "409", description = "User already exists"),
  // @ApiResponse(responseCode = "400", description = "Invalid input data")
  // })
  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(
      @Valid @RequestBody RegisterRequest request,
      HttpServletResponse response) {
    System.out.println("POST /api/v1/user/register called");

    AuthResult result = authService.register(request);

    cookieManager.addRefreshTokenCookie(response, result.getRefreshToken());

    return ResponseEntity.status(HttpStatus.CREATED).body(result.getAuthResponse());
  }

  // @Operation(summary = "Refresh Token", description = "Generates a new refresh
  // token.")
  @PostMapping("/refresh")
  public ResponseEntity<AuthResponse> refreshToken(
      @CookieValue("refreshToken") String refreshToken,
      HttpServletResponse response) {
    System.out.println("POST /api/v1/user/refreshToken called");

    AuthResult result = authService.refresh(refreshToken);

    cookieManager.addRefreshTokenCookie(response, result.getRefreshToken());

    return ResponseEntity.status(HttpStatus.OK).body(result.getAuthResponse());
  }

  // @Operation(summary = "Logout", description = "Logs out user.")
  @PostMapping("/logout")
  public ResponseEntity<Void> logout(
      HttpServletResponse response) {
    System.out.println("POST /api/v1/user/logout called");

    cookieManager.removeRefreshTokenCookie(response);

    return ResponseEntity.ok().build();
  }

}
