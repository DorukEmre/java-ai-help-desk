package dev.dorukemre.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
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
  private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

  public SecurityConfig(ReactiveJwtAuthenticationConverter jwtAuthenticationConverter,
      CorsConfiguration corsConfiguration, CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {
    this.jwtAuthenticationConverter = jwtAuthenticationConverter;
    this.corsConfiguration = corsConfiguration;
    this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
  }

  // Public endpoints
  @Bean
  @Order(1)
  public SecurityWebFilterChain publicEndpoints(ServerHttpSecurity http) {
    return http
        .securityMatcher(ServerWebExchangeMatchers
            .pathMatchers(
                HttpMethod.POST,
                "/login", "/register", "/refresh"))
        .csrf(ServerHttpSecurity.CsrfSpec::disable)
        .cors(cors -> cors.configurationSource(request -> corsConfiguration))
        .authorizeExchange(ex -> ex.anyExchange().permitAll())
        .build();
  }

  // Protected endpoints, go through JWT
  @Bean
  @Order(2)
  public SecurityWebFilterChain protectedEndpoints(ServerHttpSecurity http) {

    return http
        .cors(cors -> cors.configurationSource(request -> corsConfiguration))
        .csrf(ServerHttpSecurity.CsrfSpec::disable)
        .authorizeExchange(exchanges -> exchanges

            .pathMatchers(HttpMethod.POST, "/logout")
            .hasAnyRole("STANDARD_USER", "AGENT", "ADMIN")

            // standard user endpoints
            .pathMatchers(HttpMethod.GET, "/users/{userId}/tickets")
            .hasAnyRole("STANDARD_USER", "AGENT", "ADMIN")

            .pathMatchers(HttpMethod.POST, "/users/{userId}/tickets")
            .hasAnyRole("STANDARD_USER", "ADMIN")

            .pathMatchers(HttpMethod.GET, "/tickets/{ticketId}")
            .hasAnyRole("STANDARD_USER", "AGENT", "ADMIN")

            .pathMatchers(HttpMethod.POST, "/cloudinary/signature")
            .hasAnyRole("STANDARD_USER", "ADMIN")

            // agent endpoints
            .pathMatchers(HttpMethod.GET, "/tickets")
            .hasAnyRole("AGENT", "ADMIN")

            .pathMatchers(HttpMethod.PATCH, "/tickets/{ticketId}")
            .hasAnyRole("AGENT", "ADMIN")

            .pathMatchers(HttpMethod.GET, "/users")
            .hasAnyRole("AGENT", "ADMIN")

            // admin endpoints

            // everything else requires any authentication
            .anyExchange().authenticated())

        // JWT validation
        .oauth2ResourceServer(oauth2 -> oauth2
            .jwt(jwt -> jwt
                .jwtAuthenticationConverter(jwtAuthenticationConverter))
            .authenticationEntryPoint(customAuthenticationEntryPoint))

        .logout(logout -> logout.disable())

        .build();
  }

}
