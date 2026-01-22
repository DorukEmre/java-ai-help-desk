package dev.dorukemre.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

/**
 * Configuration class for setting up global CORS (Cross-Origin Resource
 * Sharing) settings.
 */
@Configuration
public class CorsGlobalConfiguration {

  @Value("${app.cors.allowedOrigins}")
  String origins;

  /**
   * Creates a {@link CorsConfiguration} object that defines the CORS policy.
   *
   * @return a {@link CorsConfiguration} object with the specified CORS settings
   */
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

  /**
   * Creates a {@link CorsWebFilter} that applies the specified CORS
   * configuration.
   * 
   * This filter will handle CORS requests for all endpoints (/**) based on the
   * CorsConfiguration provided. This ensures that CORS settings are applied
   * to incoming requests in a reactive application.
   *
   * @param corsConfiguration the CORS configuration to be applied
   * @return a {@link CorsWebFilter} that handles CORS requests based on the
   *         configuration
   */
  @Bean
  public CorsWebFilter corsWebFilter(CorsConfiguration corsConfiguration) {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfiguration);

    return new CorsWebFilter(source);
  }
}
