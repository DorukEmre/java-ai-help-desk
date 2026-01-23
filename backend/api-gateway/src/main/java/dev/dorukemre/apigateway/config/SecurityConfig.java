package dev.dorukemre.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;

/**
 * Configuration class for setting up security in the application using
 * Spring Security.
 * 
 * It sets up CORS configuration, CSRF protection, and access control for
 * different endpoints based on user roles and authentication.
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

  private final ReactiveJwtAuthenticationConverter jwtAuthenticationConverter;
  private final CorsConfiguration corsConfiguration;

  public SecurityConfig(ReactiveJwtAuthenticationConverter jwtAuthenticationConverter,
      CorsConfiguration corsConfiguration) {
    this.jwtAuthenticationConverter = jwtAuthenticationConverter;
    this.corsConfiguration = corsConfiguration;
  }

  @Bean
  public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

    return http
        .cors(cors -> cors.configurationSource(request -> corsConfiguration))
        .csrf(ServerHttpSecurity.CsrfSpec::disable)
        .authorizeExchange(exchanges -> exchanges
            // public endpoints
            .pathMatchers(HttpMethod.GET, "/").permitAll()
            .pathMatchers(HttpMethod.POST, "/login", "/register").permitAll()

            // standard user endpoints
            .pathMatchers(HttpMethod.GET, "/users/{userId}/tickets")
            .hasAnyRole("STANDARD_USER", "SERVICE_DESK_USER", "ADMIN")
            .pathMatchers(HttpMethod.POST, "/users/{userId}/tickets")
            .hasAnyRole("STANDARD_USER", "ADMIN")
            .pathMatchers(HttpMethod.GET, "/tickets/{ticketId}")
            .hasAnyRole("STANDARD_USER", "SERVICE_DESK_USER", "ADMIN")

            // service desk user endpoints
            .pathMatchers(HttpMethod.GET, "/tickets").hasAnyRole("SERVICE_DESK_USER", "ADMIN")
            .pathMatchers(HttpMethod.POST, "/tickets/{ticketId}")
            .hasAnyRole("SERVICE_DESK_USER", "ADMIN")
            .pathMatchers(HttpMethod.GET, "/users")
            .hasAnyRole("SERVICE_DESK_USER", "ADMIN")

            // admin endpoints

            // everything else requires any authentication
            .anyExchange().authenticated())
        // JWT validation
        .oauth2ResourceServer(oauth2 -> oauth2
            .jwt(jwt -> jwt
                .jwtAuthenticationConverter(jwtAuthenticationConverter)))
        .build();
  }

}
