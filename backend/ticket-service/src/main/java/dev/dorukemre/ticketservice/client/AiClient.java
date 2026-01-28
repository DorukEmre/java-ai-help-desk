package dev.dorukemre.ticketservice.client;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import dev.dorukemre.ticketservice.request.ChatCompletionRequest;
import dev.dorukemre.ticketservice.response.ChatCompletionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiClient {

  @Value("${pollinations.api.key}")
  private String pollinationsApiKey;

  private final RestTemplate restTemplate;

  /**
   * Generates descriptive tags for an image by sending the image URL to an
   * external AI service.
   *
   * @param imageUrl the publicly accessible URL of the image to analyze
   * @return a list of generated tags, or an empty list if none could be produced
   */
  public List<String> generateTagsFromImage(String imageUrl) {

    ChatCompletionRequest request = buildRequest(imageUrl);

    HttpEntity<ChatCompletionRequest> entity = buildHttpEntity(request);

    try {
      // Call the pollinations chat completion endpoint
      ChatCompletionResponse response = restTemplate.postForObject(
          "https://gen.pollinations.ai/v1/chat/completions",
          entity,
          ChatCompletionResponse.class);

      return extractTags(response);

    } catch (Exception e) {
      log.error("Failed to generate tags {}", e);
      return List.of();
    }

  }

  private ChatCompletionRequest buildRequest(String imageUrl) {

    return new ChatCompletionRequest(
        "gemini-fast",
        List.of(
            new ChatCompletionRequest.Message(
                "user",
                List.of(
                    new ChatCompletionRequest.TextContent(
                        "text",
                        "Analyze the image and return ONLY a STRING in the format: tag1,tag2, max 5 tags, no extra fields"),
                    new ChatCompletionRequest.ImageUrlContent(
                        "image_url",
                        new ChatCompletionRequest.ImageUrl(imageUrl))))));
  }

  private HttpEntity<ChatCompletionRequest> buildHttpEntity(ChatCompletionRequest request) {

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(pollinationsApiKey);

    return new HttpEntity<>(request, headers);
  }

  private List<String> extractTags(ChatCompletionResponse response) {

    if (response == null || response.choices() == null || response.choices().isEmpty()) {
      log.warn("AI response has no choices");
      return List.of();
    }

    String content = response.choices().get(0).message().content();

    if (content == null || content.isBlank()) {
      log.warn("AI response content is empty");
      return List.of();
    }

    log.debug("Raw AI content: {}", content);

    return Arrays.stream(
        content
            .toLowerCase()
            .replaceAll("[^a-z0-9, ]", "")
            .split(","))
        .map(String::trim)
        .filter(tag -> !tag.isBlank())
        .distinct()
        .toList();
  }

}
