package dev.dorukemre.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class JwtHeadersFilter implements GatewayFilter, Ordered {

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    return exchange.getPrincipal()
        .cast(JwtAuthenticationToken.class) // JWT already validated
        .flatMap(auth -> {
          Jwt jwt = (Jwt) auth.getToken();

          // Extract claims from JWT
          String userId = jwt.getClaimAsString("userId");
          String role = jwt.getClaimAsString("role");

          // Add as trusted headers
          ServerHttpRequest request = exchange.getRequest().mutate()
              .header("X-User-Id", userId)
              .header("X-User-Role", role)
              .build();

          return chain.filter(exchange.mutate().request(request).build());
        });
  }

  @Override
  public int getOrder() {
    return -1;
  }
}
