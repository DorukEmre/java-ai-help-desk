package dev.dorukemre.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

  // Password encoder for hashing user passwords
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  // Expose AuthenticationManager for login processing
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  // Main security filter chain
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable()) // stateless JWT, no CSRF needed
        .authorizeHttpRequests(auth -> auth
            // public endpoints
            .requestMatchers(HttpMethod.POST,
                "/api/v1/user/login",
                "/api/v1/user/register")
            .permitAll()
            // everything else requires auth
            .anyRequest().authenticated())
        .sessionManagement(sess -> sess.sessionCreationPolicy(
            SessionCreationPolicy.STATELESS))
        .build();
  }
}
