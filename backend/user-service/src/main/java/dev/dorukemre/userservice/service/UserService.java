package dev.dorukemre.userservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import dev.dorukemre.userservice.entity.Role;
import dev.dorukemre.userservice.entity.User;
import dev.dorukemre.userservice.exception.UsernameAlreadyExistsException;
import dev.dorukemre.userservice.repository.UserRepository;
import dev.dorukemre.userservice.request.LoginRequest;
import dev.dorukemre.userservice.request.RegisterRequest;
import dev.dorukemre.userservice.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

  @Autowired
  private final UserRepository userRepository;

  @Autowired
  private final PasswordEncoder passwordEncoder;

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private JwtService jwtService;

  public AuthResponse login(LoginRequest request) {
    log.info("Logging in user: {}", request);

    // Check username/password via UserDetailsService + PasswordEncoder
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(), request.getPassword()));

    // Fetch user details from DB
    User user = userRepository
        .findByUsername(request.getUsername())
        .orElseThrow(() -> new BadCredentialsException("User not found with username: " + request.getUsername()));

    // Generate JWT
    String accessToken = jwtService.generateToken(user);

    return AuthResponse.builder()
        .id(user.getId())
        .username(user.getUsername())
        .fullname(user.getFullname())
        .role(user.getRole())
        .accessToken(accessToken)
        .build();
  }

  public AuthResponse register(RegisterRequest request) {
    log.info("Registering user: {}", request);

    // Check username available
    if (userRepository.existsByUsername(request.getUsername()))
      throw new UsernameAlreadyExistsException(request.getUsername());

    // Check user role is valid
    Role role;
    try { // If conversion is successful, role is valid
      role = Role.valueOf(request.getRole().toUpperCase());
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("Invalid role: " + request.getRole());
    }

    // Hash password
    String hashedPassword = passwordEncoder.encode(request.getPassword());

    // Save user to DB
    User user = User.builder()
        .username(request.getUsername())
        .fullname(request.getFullname())
        .hashedPassword(hashedPassword)
        .role(role)
        .build();
    User savedUser = userRepository.save(user);

    // Authenticate immediately
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            savedUser.getUsername(),
            request.getPassword()));

    // Generate JWT
    String accessToken = jwtService.generateToken(savedUser);

    return AuthResponse.builder()
        .id(savedUser.getId())
        .username(savedUser.getUsername())
        .fullname(savedUser.getFullname())
        .role(savedUser.getRole())
        .accessToken(accessToken)
        .build();
  }

}
