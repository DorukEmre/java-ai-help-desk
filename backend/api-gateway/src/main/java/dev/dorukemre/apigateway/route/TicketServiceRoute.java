package dev.dorukemre.apigateway.route;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
public class TicketServiceRoute {

  @Value("${TICKET_BASE_URL}")
  private String baseUrl;

  @Bean
  public RouteLocator ticketRoutes(RouteLocatorBuilder builder) {

    String uri = "http://" + baseUrl;

    return builder.routes()

        // standard user routes

        .route("list-user-tickets", r -> r
            .path("/users/{userId}/tickets")
            .and().method(HttpMethod.GET)
            .filters(f -> f.prefixPath("/api/v1/ticket"))
            .uri(uri))

        .route("create-ticket", r -> r
            .path("/users/{userId}/tickets")
            .and().method(HttpMethod.POST)
            .filters(f -> f.prefixPath("/api/v1/ticket"))
            .uri(uri))

        // service desk user routes

        .route("list-all-tickets", r -> r
            .path("/tickets")
            .and().method(HttpMethod.GET)
            .filters(f -> f.prefixPath("/api/v1/ticket"))
            .uri(uri))

        .build();
  }

}
