package dev.dorukemre.apigateway.route;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import dev.dorukemre.apigateway.filter.JwtHeadersFilter;

@Configuration
public class TicketServiceRoute {

  @Value("${TICKET_BASE_URL}")
  private String baseUrl;

  private final JwtHeadersFilter jwtHeadersFilter;

  public TicketServiceRoute(JwtHeadersFilter jwtHeadersFilter) {
    this.jwtHeadersFilter = jwtHeadersFilter;
  }

  @Bean
  public RouteLocator ticketRoutes(RouteLocatorBuilder builder) {

    String uri = "http://" + baseUrl;

    return builder.routes()

        // standard user routes

        .route("list-user-tickets", r -> r
            .path("/users/{userId}/tickets")
            .and().method(HttpMethod.GET)
            .filters(f -> f
                .prefixPath("/api/v1/ticket")
                .filter(jwtHeadersFilter))
            .uri(uri))

        .route("create-ticket", r -> r
            .path("/users/{userId}/tickets")
            .and().method(HttpMethod.POST)
            .filters(f -> f
                .prefixPath("/api/v1/ticket")
                .filter(jwtHeadersFilter))
            .uri(uri))

        .route("get-ticket", r -> r
            .path("/tickets/{ticketId}")
            .and().method(HttpMethod.GET)
            .filters(f -> f
                .prefixPath("/api/v1/ticket")
                .filter(jwtHeadersFilter))
            .uri(uri))

        .route("get-cloudinary-signature", r -> r
            .path("/cloudinary/signature")
            .and().method(HttpMethod.POST)
            .filters(f -> f
                .prefixPath("/api/v1/ticket")
                .filter(jwtHeadersFilter))
            .uri(uri))

        // agent routes

        .route("list-all-tickets", r -> r
            .path("/tickets")
            .and().method(HttpMethod.GET)
            .filters(f -> f.prefixPath("/api/v1/ticket"))
            .uri(uri))

        .route("update-ticket", r -> r
            .path("/tickets/{ticketId}")
            .and().method(HttpMethod.PATCH)
            .filters(f -> f
                .prefixPath("/api/v1/ticket")
                .filter(jwtHeadersFilter))
            .uri(uri))

        .build();
  }

}
