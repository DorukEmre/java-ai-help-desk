package dev.dorukemre.ticketservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import dev.dorukemre.ticketservice.entity.Role;
import dev.dorukemre.ticketservice.entity.Ticket;
import dev.dorukemre.ticketservice.repository.TicketRepository;
import dev.dorukemre.ticketservice.request.TicketCreationRequest;
import dev.dorukemre.ticketservice.response.TicketCreationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TicketService {

  @Autowired
  private final TicketRepository ticketRepository;

  public TicketCreationResponse createTicket(
      String headerUserId, String pathUserId, TicketCreationRequest request) {
    log.info("Creating ticket with request: {}", request);
    System.out.println("headerUserId: " + headerUserId + ", pathUserId: " + pathUserId);

    if (!pathUserId.equals(headerUserId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User ID mismatch");
    }

    Ticket ticket = new Ticket();
    ticket.setDescription(request.getDescription());
    ticket.setUserId(headerUserId);
    Ticket savedTicket = ticketRepository.save(ticket);

    return TicketCreationResponse.builder()
        .description(savedTicket.getDescription())
        .status(savedTicket.getStatus())
        .build();
  }

  public List<Ticket> listTicketsByUserId(
      String headerUserRole, String headerUserId, String pathUserId) {
    System.out.println(
        "headerUserRole: " + headerUserRole + ", headerUserId: " + headerUserId + " listing pathUserId: " + pathUserId);

    Role role;
    try {
      role = Role.valueOf(headerUserRole);
    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid role");
    }

    // Standard user can only list its own tickets
    if (!pathUserId.equals(headerUserId)
        && role != Role.SERVICE_DESK_USER && role != Role.ADMIN) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User ID mismatch");
    }

    return ticketRepository.findAllByUserId(pathUserId);
  }

  public List<Ticket> listTickets() {
    return ticketRepository.findAll();
  }
}
