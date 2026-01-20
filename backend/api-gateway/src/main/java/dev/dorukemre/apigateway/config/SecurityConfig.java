package dev.dorukemre.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.config.web.server.ServerHttpSecurity;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

  @Bean
  public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

    return http
        .csrf(ServerHttpSecurity.CsrfSpec::disable)
        .authorizeExchange(exchanges -> exchanges
            // public endpoints
            .pathMatchers(HttpMethod.POST, "/login", "/register").permitAll()
            .pathMatchers(HttpMethod.GET, "/tickets").permitAll()
            // everything else requires auth
            .anyExchange().authenticated())
        // JWT validation
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {
        }))
        .build();
  }

}
