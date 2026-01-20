package dev.dorukemre.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;

@Configuration
public class JwtDecoderConfig {

  @Value("${spring.security.oauth2.resourceserver.jwt.secret}")
  private String SECRET;

  @Bean
  public ReactiveJwtDecoder reactiveJwtDecoder() {
    byte[] keyBytes = SECRET.getBytes();
    return NimbusReactiveJwtDecoder.withSecretKey(
        new javax.crypto.spec.SecretKeySpec(keyBytes, "HmacSHA256")).build();
  }
}
