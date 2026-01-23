package dev.dorukemre.ticketservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Service

@RequiredArgsConstructor
public class UserServiceClient {

  @Value("${user.service.url}")
  private String userServiceUrl;

  private final RestTemplate restTemplate;

  public void checkAgent(final String agentId) {

    final String url = userServiceUrl + "/users/" + agentId + "/check";

    try {
      restTemplate.getForEntity(url, Void.class, agentId);

    } catch (HttpClientErrorException.NotFound e) {
      throw new IllegalArgumentException("Agent does not exist");
    } catch (HttpClientErrorException.Forbidden
        | HttpClientErrorException.BadRequest e) {
      throw new IllegalArgumentException("User is not a valid agent");
    }
  }

  // Agent exists and is valid 200 OK
  // Agent does not exist 404 Not Found
  // User exists but is not an agent 400 Bad Request
}
