package dev.dorukemre.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Logs details of incoming HTTP requests.
 * 
 * This filter intercepts every request passing through the gateway and logs
 * the HTTP method and the URI of the request.
 *
 * The logging occurs before any further processing of the request by other
 * filters or handlers.
 */
@Component
public class LoggingFilter implements GlobalFilter, Ordered {

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    System.out.println("Request: " + exchange.getRequest().getMethod() + " " + exchange.getRequest().getURI());

    return chain.filter(exchange);
  }

  @Override
  public int getOrder() {
    return -2;
  }
}