package dev.dorukemre.ticketservice.event;

import dev.dorukemre.ticketservice.entity.Ticket;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class TicketCreatedEvent {
  private final Ticket ticket;
}
