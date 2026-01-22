package dev.dorukemre.ticketservice.listener;

import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import dev.dorukemre.ticketservice.entity.Ticket;
import dev.dorukemre.ticketservice.event.TicketCreatedEvent;

@Component
public class TicketEventListener {

  @EventListener
  @Async
  public void handleTicketCreatedEvent(TicketCreatedEvent event) {
    System.out.println("Processing created ticket...");
    Ticket ticket = event.getTicket();

    List<String> tags = ticket.getTags();

    System.out.println("Ticket tags: " + tags);
  }
}
