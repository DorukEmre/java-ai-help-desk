package dev.dorukemre.userservice.exception;

public class InvalidAgentRoleException extends RuntimeException {

  public InvalidAgentRoleException(String userId) {
    super("User is not a valid agent: " + userId);
  }
}
