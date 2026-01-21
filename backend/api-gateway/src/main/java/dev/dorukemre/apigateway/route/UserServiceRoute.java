package dev.dorukemre.apigateway.route;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
public class UserServiceRoute {

  @Value("${USER_BASE_URL}")
  private String baseUrl;

  @Bean
  public RouteLocator userRoutes(RouteLocatorBuilder builder) {

    String uri = "http://" + baseUrl;

    return builder.routes()

        // public routes

        .route("login", r -> r
            .path("/login")
            .and().method(HttpMethod.POST)
            .filters(f -> f.prefixPath("/api/v1/user"))
            .uri(uri))

        .route("register", r -> r
            .path("/register")
            .and().method(HttpMethod.POST)
            .filters(f -> f.prefixPath("/api/v1/user"))
            .uri(uri))

        // internal routes

        .route("list-users", r -> r
            .path("/users")
            .and().method(HttpMethod.GET)
            .filters(f -> f.prefixPath("/api/v1/user"))
            .uri(uri))

        .build();
  }

}
