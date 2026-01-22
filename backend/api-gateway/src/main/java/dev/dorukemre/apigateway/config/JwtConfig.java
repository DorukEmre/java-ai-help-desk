package dev.dorukemre.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtGrantedAuthoritiesConverterAdapter;

@Configuration
public class JwtConfig {

  @Value("${spring.security.oauth2.resourceserver.jwt.secret}")
  private String SECRET;

  /**
   * Creates a decoder {@link ReactiveJwtDecoder} for JSON Web
   * Tokens (JWTs) using a secret key.
   *
   * @return a {@link ReactiveJwtDecoder} that can decode JWTs with the
   *         configured secret key.
   */
  @Bean
  public ReactiveJwtDecoder reactiveJwtDecoder() {
    byte[] keyBytes = SECRET.getBytes();
    return NimbusReactiveJwtDecoder.withSecretKey(
        new javax.crypto.spec.SecretKeySpec(keyBytes, "HmacSHA256")).build();
  }

  /**
   * Creates a converter {@link ReactiveJwtAuthenticationConverter}
   * that converts JWTs into authentication tokens with granted authorities
   * based on the roles defined in the JWT.
   *
   * @return a {@link ReactiveJwtAuthenticationConverter} that can turn JWTs
   *         into authentication tokens with roles.
   */
  @Bean
  public ReactiveJwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
    authoritiesConverter.setAuthorityPrefix("ROLE_");
    authoritiesConverter.setAuthoritiesClaimName("role");

    ReactiveJwtAuthenticationConverter converter = new ReactiveJwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(
        new ReactiveJwtGrantedAuthoritiesConverterAdapter(authoritiesConverter));

    return converter;
  }
}
