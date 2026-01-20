package dev.dorukemre.ticketservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

  public TicketCreationResponse createTicket(TicketCreationRequest request) {
    log.info("Creating ticket with request: {}", request);

    Ticket ticket = new Ticket();
    ticket.setDescription(request.getDescription());
    // ticket.setUserId(null);
    Ticket savedTicket = ticketRepository.save(ticket);

    return TicketCreationResponse.builder()
        .description(savedTicket.getDescription())
        .status(savedTicket.getStatus())
        .build();
  }

  public List<Ticket> listTicketsByUserId(String userId) {
    System.out.println("userId: " + userId);

    return ticketRepository.findAllByUserId(userId);
  }

  public List<Ticket> listTickets() {
    return ticketRepository.findAll();
  }
}
