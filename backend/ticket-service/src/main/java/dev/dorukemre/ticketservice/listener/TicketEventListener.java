package dev.dorukemre.ticketservice.listener;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import dev.dorukemre.ticketservice.entity.Ticket;
import dev.dorukemre.ticketservice.event.TicketCreatedEvent;
import dev.dorukemre.ticketservice.service.TicketTaggingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class TicketEventListener {

  private final TicketTaggingService ticketTaggingService;

  /**
   * Handles {@link TicketCreatedEvent} asynchronously.
   * 
   * Delegates ticket tagging to {@link TicketTaggingService} after a ticket
   * is created.
   */
  @EventListener
  @Async
  public void handleTicketCreatedEvent(TicketCreatedEvent event) {

    Ticket ticket = event.getTicket();
    log.info("Processing created ticket {}", ticket.getId());

    ticketTaggingService.tagTicket(ticket);
  }
}
