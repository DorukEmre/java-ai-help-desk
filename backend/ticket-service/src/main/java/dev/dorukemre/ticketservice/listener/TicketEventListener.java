package dev.dorukemre.ticketservice.listener;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import dev.dorukemre.ticketservice.entity.Ticket;
import dev.dorukemre.ticketservice.event.TicketCreatedEvent;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TicketEventListener {

  @Value("${cloudinary.cloud.name}")
  private String cloudName;

  @Value("${pollinations.api.key}")
  private String pollinationsApiKey;

  private final RestTemplate restTemplate;

  @EventListener
  @Async
  public void handleTicketCreatedEvent(TicketCreatedEvent event) {
    System.out.println("Processing created ticket...");
    Ticket ticket = event.getTicket();

    String imageUrl = "https://res.cloudinary.com/" + cloudName + "/image/upload/"
        + ticket.getCloudinaryPublicId();

    Map<String, Object> payload = Map.of(
        "model", "openai",
        "messages", List.of(Map.of(
            "role", "user",
            "content", List.of(
                Map.of("type", "text", "text",
                    "Analyze the image and return ONLY a JSON object in the format {\"tags\": [\"tag1\",\"tag2\"]}, max 10 tags, no extra fields"),
                Map.of("type", "image_url", "image_url", Map.of("url", imageUrl))))));

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer " + pollinationsApiKey);

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

    @SuppressWarnings("unchecked")
    Map<String, Object> response = restTemplate.postForObject(
        "https://gen.pollinations.ai/v1/chat/completions",
        entity,
        Map.class);

    try {

      @SuppressWarnings("unchecked")
      List<String> tags = (List<String>) ((Map<String, Object>) ((List<Object>) response.get("messages")).get(0))
          .get("tags");
      ticket.setTags(tags);

      System.out.println("Tags for ticket: " + tags);

    } catch (Exception e) {
      System.err.println("Failed to parse tags from AI response: " + e.getMessage());
    }

  }
}
