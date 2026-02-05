package dev.dorukemre.userservice.service;

import java.util.EnumSet;
import java.util.List;

import org.springframework.stereotype.Service;

import dev.dorukemre.userservice.entity.Role;
import dev.dorukemre.userservice.entity.User;
import dev.dorukemre.userservice.exception.InvalidAgentRoleException;
import dev.dorukemre.userservice.exception.UserNotFoundException;
import dev.dorukemre.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  /**
   * Retrieves users from the repository, optionally filtered by role.
   *
   * @param roleStr optional role name used to filter users
   * @return list of users matching the criteria, or all users if no role is
   *         provided
   * @throws IllegalArgumentException if {@code roleStr} does not map to a valid
   *                                  {@link Role}
   */
  public List<User> listUsers(String roleStr) {
    log.info("Listing users");

    if (roleStr != null && !roleStr.isBlank()) {
      Role role;
      try {
        role = Role.valueOf(roleStr.toUpperCase());
      } catch (IllegalArgumentException e) {
        throw new IllegalArgumentException("Invalid role: " + roleStr);
      }

      return userRepository.findAllByRole(role);
    }
    return userRepository.findAll();
  }

  /**
   * Validates that the specified user exists and has an agent-capable role
   * ({@link Role#AGENT} or {@link Role#ADMIN}).
   * 
   * @param agentId identifier of the user to validate
   * @throws UserNotFoundException     if the user does not exist
   * @throws InvalidAgentRoleException if the user does not have an
   *                                   agent-capable role
   */
  public void checkAgent(String agentId) {
    log.info("Checking agent: {}", agentId);

    User user = userRepository.findById(agentId).orElseThrow(() -> new UserNotFoundException(agentId));

    if (!EnumSet.of(Role.AGENT, Role.ADMIN).contains(user.getRole())) {
      throw new InvalidAgentRoleException(agentId);
    }
  }

}
