package dev.dorukemre.ticketservice.service;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import dev.dorukemre.ticketservice.client.UserServiceClient;
import dev.dorukemre.ticketservice.entity.Role;
import dev.dorukemre.ticketservice.entity.Ticket;
import dev.dorukemre.ticketservice.event.TicketCreatedEvent;
import dev.dorukemre.ticketservice.repository.TicketRepository;
import dev.dorukemre.ticketservice.request.TicketCreationRequest;
import dev.dorukemre.ticketservice.request.UpdateTicketRequest;
import dev.dorukemre.ticketservice.response.TicketCreationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TicketService {

  private final TicketRepository ticketRepository;

  private final UserServiceClient userServiceClient;

  private final ApplicationEventPublisher publisher;

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

    // Publish ticket creation event
    publisher.publishEvent(new TicketCreatedEvent(savedTicket));

    return TicketCreationResponse.builder()
        .id(savedTicket.getId())
        .description(savedTicket.getDescription())
        .status(savedTicket.getStatus())
        .createdAt(savedTicket.getCreatedAt().toString())
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

  public Ticket getTicket(
      String userRole, String userId, String ticketId) {
    log.info("Getting ticket with id: {}", ticketId);
    System.out.println("userRole: " + userRole + ", userId: " + userId);

    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

    Role role;
    try {
      role = Role.valueOf(userRole);
    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid role");
    }

    // Standard user can only see its own ticket
    if (!userId.equals(ticket.getUserId())
        && role != Role.SERVICE_DESK_USER && role != Role.ADMIN) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User ID mismatch");
    }

    return ticket;
  }

  public Ticket updateTicket(
      String ticketId, String field, UpdateTicketRequest request) {
    log.info("Updating ticket with id: {}, {}, {}", ticketId, field, request);

    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

    switch (field) {
      case "status":
        if (request.getStatus() != null) {
          String status = request.getStatus().toUpperCase();

          // Can't be IN_PROGRESS without an agent assigned
          if (status.equals("IN_PROGRESS") && ticket.getAgentId() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Can't set status to IN_PROGRESS without assigning to agent");

          // Remove agent when setting to OPEN
          if (status.equals("OPEN"))
            ticket.setAgentId(null);

          ticket.setStatus(status);
        }
        break;

      case "agentId":
        if (request.getAgentId() != null) {
          // Check that assigned agent exists and has correct role
          userServiceClient.checkAgent(request.getAgentId());
          // Set status to IN_PROGRESS when agent assigned
          if (ticket.getStatus().equals("OPEN")) {
            ticket.setStatus("IN_PROGRESS");
          }
        } else {
          ticket.setStatus("OPEN");
        }
        ticket.setAgentId(request.getAgentId());
        break;

      case "actions":
        if (request.getActions() != null) {
          ticket.setActions(request.getActions());
        }
        break;

      case "tags":
        if (request.getTags() != null) {
          ticket.setTags(request.getTags());
        }
        break;

      default:
        throw new IllegalArgumentException("Invalid field: " + field);
    }

    return ticketRepository.save(ticket);
  }

}
