package dev.dorukemre.userservice.service;

import java.time.Instant;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import dev.dorukemre.userservice.entity.RefreshToken;
import dev.dorukemre.userservice.entity.Role;
import dev.dorukemre.userservice.entity.User;
import dev.dorukemre.userservice.exception.InvalidRefreshTokenException;
import dev.dorukemre.userservice.exception.RefreshTokenExpiredException;
import dev.dorukemre.userservice.exception.UserNotFoundException;
import dev.dorukemre.userservice.exception.UsernameAlreadyExistsException;
import dev.dorukemre.userservice.repository.RefreshTokenRepository;
import dev.dorukemre.userservice.repository.UserRepository;
import dev.dorukemre.userservice.request.LoginRequest;
import dev.dorukemre.userservice.request.RegisterRequest;
import dev.dorukemre.userservice.response.AuthResponse;
import dev.dorukemre.userservice.security.JwtService;
import dev.dorukemre.userservice.service.dto.AuthResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  public AuthResult login(LoginRequest request) {
    log.info("Logging in user: {}", request);

    // Check username/password via UserDetailsService + PasswordEncoder
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(), request.getPassword()));

    // Fetch user details from DB
    User user = userRepository
        .findByUsername(request.getUsername())
        .orElseThrow(() -> new BadCredentialsException("User not found with username: " + request.getUsername()));

    // Generate access token
    String accessToken = jwtService.generateAccessToken(user);

    // Generate refresh token, create RefreshToken entity, hash token, save to DB
    String refreshToken = jwtService.generateRefreshToken();
    jwtService.createAndPersistRefreshToken(refreshToken, user.getId());

    return (new AuthResult(
        AuthResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .fullname(user.getFullname())
            .role(user.getRole())
            .accessToken(accessToken)
            .build(),
        refreshToken));
  }

  public AuthResult register(RegisterRequest request) {
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

    // Save User to DB
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

    // Generate access token
    String accessToken = jwtService.generateAccessToken(savedUser);

    // Generate refresh token, create RefreshToken entity, hash token, save to DB
    String refreshToken = jwtService.generateRefreshToken();
    jwtService.createAndPersistRefreshToken(refreshToken, user.getId());

    return (new AuthResult(
        AuthResponse.builder()
            .id(savedUser.getId())
            .username(savedUser.getUsername())
            .fullname(savedUser.getFullname())
            .role(savedUser.getRole())
            .accessToken(accessToken)
            .build(),
        refreshToken));
  }

  public AuthResult refresh(String refreshToken) {
    log.info("Refreshing token...");

    String hashedToken = jwtService.hashToken(refreshToken);

    RefreshToken tokenEntity = refreshTokenRepository
        .findByTokenHashAndRevokedFalse(hashedToken)
        .orElseThrow(() -> new InvalidRefreshTokenException());

    if (tokenEntity.getExpiresAt().isBefore(Instant.now())) {
      refreshTokenRepository.delete(tokenEntity);
      throw new RefreshTokenExpiredException();
    }

    User user = userRepository.findById(tokenEntity.getUserId())
        .orElseThrow(() -> new UserNotFoundException());

    String newAccessToken = jwtService.generateAccessToken(user);

    // Generate new refresh token, hash and save existing entity to DB
    String newRefreshToken = jwtService.generateRefreshToken();
    jwtService.hashAndPersistRefreshToken(newRefreshToken, tokenEntity);

    return (new AuthResult(
        AuthResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .fullname(user.getFullname())
            .role(user.getRole())
            .accessToken(newAccessToken)
            .build(),
        newRefreshToken));
  }

}
