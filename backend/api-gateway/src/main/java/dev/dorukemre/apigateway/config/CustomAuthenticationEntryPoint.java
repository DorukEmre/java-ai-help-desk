package dev.dorukemre.apigateway.config;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.oauth2.jwt.JwtValidationException;
import reactor.core.publisher.Mono;
import org.springframework.web.server.ServerWebExchange;

/**
 * Handles JWT authentication failures.
 * <p>
 * Returns HTTP 401 with a JSON body indicating the specific failure:
 * <ul>
 * <li>{@code ACCESS_TOKEN_EXPIRED} – token expired</li>
 * <li>{@code INVALID_ACCESS_TOKEN} – token invalid or malformed</li>
 * </ul>
 * The frontend can use the {@code code} field to decide whether to refresh the
 * token or prompt login.
 */
@Component
public class CustomAuthenticationEntryPoint implements ServerAuthenticationEntryPoint {

  @Override
  public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException ex) {
    ServerHttpResponse response = exchange.getResponse();
    response.getHeaders().add("Content-Type", "application/json");

    String body;

    if (ex.getCause() instanceof JwtValidationException) {
      // Token expired
      body = "{\"code\":\"ACCESS_TOKEN_EXPIRED\"}";
    } else {
      // Invalid token
      body = "{\"code\":\"INVALID_ACCESS_TOKEN\"}";
    }

    response.setStatusCode(HttpStatus.UNAUTHORIZED);
    return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
  }
}
