package dev.dorukemre.userservice.service;

import java.time.Instant;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import dev.dorukemre.userservice.entity.User;

@Service
public class JwtService {

  @Value("${spring.security.oauth2.resourceserver.jwt.secret}")
  private String SECRET;

  private static final long EXPIRATION_SECONDS = 9000; // 150 min

  public String generateToken(User user) {
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
}
