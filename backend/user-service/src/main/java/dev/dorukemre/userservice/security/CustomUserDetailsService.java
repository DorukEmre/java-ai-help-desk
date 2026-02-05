package dev.dorukemre.userservice.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import dev.dorukemre.userservice.entity.User;
import dev.dorukemre.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;

/**
 * Spring Security adapter that loads application users from the database
 * for authentication.
 *
 * <p>
 * Used by {@link DaoAuthenticationProvider}
 * to retrieve user credentials and roles during login. Maps the domain
 * {@code User} entity to Spring Security's {@link UserDetails}.
 * </p>
 *
 * <p>
 * Throws {@link UsernameNotFoundException}
 * if the user does not exist.
 * </p>
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    return org.springframework.security.core.userdetails.User
        .withUsername(user.getUsername())
        .password(user.getHashedPassword())
        .roles(user.getRole().name())
        .build();
  }
}
