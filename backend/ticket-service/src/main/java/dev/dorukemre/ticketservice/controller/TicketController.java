package dev.dorukemre.ticketservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.dorukemre.ticketservice.entity.Ticket;
import dev.dorukemre.ticketservice.request.TicketCreationRequest;
import dev.dorukemre.ticketservice.response.TicketCreationResponse;
import dev.dorukemre.ticketservice.service.ServiceDeskUserService;
import dev.dorukemre.ticketservice.service.StandardUserService;
import dev.dorukemre.ticketservice.service.TicketService;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ticket")
public class TicketController {

  private final TicketService ticketService;

  // standard user routes

  // @Operation(summary = "List all tickets for given user", description =
  // "Retrieves all tickets by user ID.")
  // @ApiResponses(value = {
  // @ApiResponse(responseCode = "", description = ""),
  // @ApiResponse(responseCode = "", description = "")
  // })
  // @GetMapping("/users/{userId}/tickets")
  // public List<Ticket> listTicketsByUserId(@PathVariable String userId) {
  // System.out.println("GET /api/v1/users/{userId}/tickets called");

  // return ticketService.listTicketsByUserId(userId);
  // }

  // @Operation(summary = "Create a new ticket", description = "Creates a new
  // ticket.")
  @PostMapping(value = "/users/{userId}/tickets")
  public ResponseEntity<TicketCreationResponse> createTicket(@RequestBody TicketCreationRequest request) {
    System.out.println("POST /api/v1/users/{userId}/tickets called");

    TicketCreationResponse response = ticketService.createTicket(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  // service desk user routes

  // @Operation(summary = "List all tickets", description =
  // "Retrieves all tickets.")
  // @GetMapping("/tickets")
  // public List<Ticket> listTickets() {
  // System.out.println("GET /api/v1/tickets called");

  // return ticketService.listTickets();
  // }

}
