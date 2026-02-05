package dev.dorukemre.userservice.security;

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.MessageDigest;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import dev.dorukemre.userservice.entity.RefreshToken;
import dev.dorukemre.userservice.entity.User;
import dev.dorukemre.userservice.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {

  @Value("${spring.security.oauth2.resourceserver.jwt.secret}")
  private String SECRET;

  private static final long EXPIRATION_SECONDS = 900; // 15 min

  private final RefreshTokenRepository refreshTokenRepository;

  public String generateAccessToken(User user) {
    try {
      JWTClaimsSet claims = new JWTClaimsSet.Builder()
          .subject(user.getUsername())
          .claim("role", user.getRole().name())
          .claim("userId", user.getId())
          .issueTime(Date.from(Instant.now()))
          .expirationTime(Date.from(Instant.now().plusSeconds(EXPIRATION_SECONDS)))
          .build();

      SignedJWT signedJWT = new SignedJWT(
          new JWSHeader(JWSAlgorithm.HS256),
          claims);

      signedJWT.sign(new MACSigner(SECRET));

      return signedJWT.serialize();

    } catch (JOSEException e) {
      throw new IllegalStateException("JWT signing failed", e);
    }
  }

  public String generateRefreshToken() {
    return UUID.randomUUID().toString() + UUID.randomUUID();
  }

  public String hashToken(String token) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hashBytes = digest.digest(token.getBytes(StandardCharsets.UTF_8));
      StringBuilder hexString = new StringBuilder();
      for (byte b : hashBytes) {
        String hex = Integer.toHexString(0xff & b);
        if (hex.length() == 1)
          hexString.append('0');
        hexString.append(hex);
      }
      return hexString.toString();
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("SHA-256 algorithm not available", e);
    }
  }

  public void hashAndPersistRefreshToken(String rawToken, RefreshToken tokenEntity) {

    String newHashedToken = hashToken(rawToken);
    tokenEntity.setTokenHash(newHashedToken);
    tokenEntity.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));
    refreshTokenRepository.save(tokenEntity);
  }

  public void createAndPersistRefreshToken(String rawToken, String userId) {

    RefreshToken tokenEntity = RefreshToken.builder()
        .userId(userId)
        .createdAt(Instant.now())
        .build();

    hashAndPersistRefreshToken(rawToken, tokenEntity);
  }

}
