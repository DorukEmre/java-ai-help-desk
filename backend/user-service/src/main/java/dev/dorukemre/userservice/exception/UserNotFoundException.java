package dev.dorukemre.userservice.exception;

public class UserNotFoundException extends RuntimeException {

  public UserNotFoundException() {
    super("User not found");
  }

  public UserNotFoundException(String userId) {
    super("User not found with id: " + userId);
  }
}
