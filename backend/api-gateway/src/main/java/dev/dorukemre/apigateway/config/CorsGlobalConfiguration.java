package dev.dorukemre.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsGlobalConfiguration {

  @Value("${app.cors.allowedOrigins}")
  String origins;

  @Bean
  public CorsConfiguration corsConfiguration() {
    CorsConfiguration corsConfig = new CorsConfiguration();

    corsConfig.addAllowedOriginPattern("*");
    // corsConfig.setAllowedOrigins(Arrays.asList(origins.split(",")));
    // for (String origin : allowedOrigins) {
    // corsConfig.addAllowedOrigin(origin);
    // }
    corsConfig.setAllowCredentials(true);
    // corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE",
    // "OPTIONS"));
    // corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type",
    // "X-Requested-With"));
    corsConfig.addAllowedMethod("*");
    corsConfig.addAllowedHeader("*");

    return corsConfig;
  }

  @Bean
  public CorsWebFilter corsWebFilter(CorsConfiguration corsConfiguration) {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfiguration);

    return new CorsWebFilter(source);
  }
}
