package dev.dorukemre.userservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.dorukemre.userservice.entity.User;
import dev.dorukemre.userservice.request.LoginRequest;
import dev.dorukemre.userservice.request.RegisterRequest;
import dev.dorukemre.userservice.response.AuthResponse;
import dev.dorukemre.userservice.service.UserService;
import dev.dorukemre.userservice.service.dto.AuthResult;
// import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {

  private final UserService userService;

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

    AuthResult result = userService.login(request);

    addRefreshTokenCookie(response, result.getRefreshToken());

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

    AuthResult result = userService.register(request);

    addRefreshTokenCookie(response, result.getRefreshToken());

    return ResponseEntity.status(HttpStatus.CREATED).body(result.getAuthResponse());
  }

  // @Operation(summary = "Refresh Token", description = "Generates a new refresh
  // token.")
  @PostMapping("/refresh")
  public ResponseEntity<AuthResponse> refreshToken(
      @CookieValue("refreshToken") String refreshToken,
      HttpServletResponse response) {
    System.out.println("POST /api/v1/user/refreshToken called");

    AuthResult result = userService.refresh(refreshToken);

    addRefreshTokenCookie(response, result.getRefreshToken());

    return ResponseEntity.status(HttpStatus.OK).body(result.getAuthResponse());
  }

  // @Operation(summary = "List all users", description = "Retrieves all
  // users.")
  @GetMapping("/users")
  public List<User> listUsers(@RequestParam(name = "role", required = false) String role) {
    System.out.println("GET /api/v1/user/users called with role=" + role);

    return userService.listUsers(role);
  }

  // @Operation(summary = "Check user is a valid agent", description = "Checks if
  // the user exists and has role AGENT or ADMIN")
  @GetMapping("/users/{agentId}/check")
  public ResponseEntity<Void> checkAgent(@PathVariable("agentId") String agentId) {
    System.out.println("GET /api/v1/user/users/{agentId}/check called");

    userService.checkAgent(agentId);

    return ResponseEntity.ok().build();

  }

  private void addRefreshTokenCookie(
      HttpServletResponse response,
      String refreshToken) {

    // Cookie cookie = new Cookie("refreshToken", refreshToken);
    // cookie.setHttpOnly(true);
    // cookie.setSecure(true);
    // cookie.setPath("/refresh");
    // cookie.setMaxAge(7 * 24 * 60 * 60);
    // response.addCookie(cookie);

    // dev
    response.addHeader(
        "Set-Cookie",
        "refreshToken=" + refreshToken
            + "; HttpOnly; Secure; SameSite=None; Path=/refresh; Max-Age=604800");

    // prod
    // response.addHeader(
    // "Set-Cookie",
    // "refreshToken=" + refreshToken
    // + "; HttpOnly; Secure; SameSite=Strict; Path=/refresh; Max-Age=604800");
  }

}
