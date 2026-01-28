package dev.dorukemre.ticketservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import dev.dorukemre.ticketservice.client.AiClient;
import dev.dorukemre.ticketservice.entity.Ticket;
import dev.dorukemre.ticketservice.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketTaggingService {

  @Value("${cloudinary.cloud.name}")
  private String cloudName;

  private final AiClient aiClient;

  private final TicketRepository ticketRepository;

  /**
   * Generates AI-based tags for the given ticket and persists the result.
   * 
   * @param ticket the ticket to be tagged
   */
  public void tagTicket(Ticket ticket) {

    if (ticket.getTags() != null && !ticket.getTags().isEmpty()) {
      return;
    }

    if (ticket.getCloudinaryPublicId() == null) {
      log.warn("Ticket {} has no image to tag", ticket.getId());
      return;
    }

    try {

      // Build ticket image url
      String imageUrl = "https://res.cloudinary.com/" + cloudName
          + "/image/upload/" + ticket.getCloudinaryPublicId();

      // Call AI client to generate tags
      List<String> tags = aiClient.generateTagsFromImage(imageUrl);

      if (tags.isEmpty()) {
        log.warn("No tags generated for ticket {}", ticket.getId());
        return;
      }

      // Update ticket
      ticket.setTags(tags);
      ticketRepository.save(ticket);

      log.info("Tags {} added to ticket {}", tags, ticket.getId());

    } catch (Exception e) {
      log.error("Failed to tag ticket {}", ticket.getId(), e);
    }
  }

}
