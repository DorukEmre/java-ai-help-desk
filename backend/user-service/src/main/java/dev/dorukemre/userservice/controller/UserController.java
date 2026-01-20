package dev.dorukemre.userservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.dorukemre.userservice.request.LoginRequest;
import dev.dorukemre.userservice.request.RegisterRequest;
import dev.dorukemre.userservice.response.AuthResponse;
import dev.dorukemre.userservice.service.UserService;
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
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    System.out.println("POST /api/v1/user/login called");

    AuthResponse response = userService.login(request);
    return ResponseEntity.status(HttpStatus.OK).body(response);
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
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    System.out.println("POST /api/v1/user/register called");

    AuthResponse response = userService.register(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

}
