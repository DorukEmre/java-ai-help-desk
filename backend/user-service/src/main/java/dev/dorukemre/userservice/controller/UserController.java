package dev.dorukemre.userservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.dorukemre.userservice.entity.User;
import dev.dorukemre.userservice.service.UserService;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {

  private final UserService userService;

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

}
