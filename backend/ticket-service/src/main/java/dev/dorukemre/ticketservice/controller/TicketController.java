package dev.dorukemre.ticketservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.dorukemre.ticketservice.entity.Ticket;
import dev.dorukemre.ticketservice.request.TicketCreationRequest;
import dev.dorukemre.ticketservice.request.UpdateTicketRequest;
import dev.dorukemre.ticketservice.response.TicketCreationResponse;
import dev.dorukemre.ticketservice.service.TicketService;
import jakarta.validation.Valid;
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
  @GetMapping("/users/{userId}/tickets")
  public List<Ticket> listTicketsByUserId(
      @RequestHeader("X-User-Role") String headerUserRole,
      @RequestHeader("X-User-Id") String headerUserId,
      @PathVariable("userId") String pathUserId) {
    System.out.println("GET /api/v1/ticket/users/{userId}/tickets called");

    return ticketService.listTicketsByUserId(headerUserRole, headerUserId, pathUserId);
  }

  // @Operation(summary = "Create a new ticket", description = "Creates a new
  // ticket.")
  @PostMapping(value = "/users/{userId}/tickets")
  public ResponseEntity<TicketCreationResponse> createTicket(
      @RequestHeader("X-User-Id") String headerUserId,
      @PathVariable("userId") String pathUserId,
      @Valid @RequestBody TicketCreationRequest request) {
    System.out.println("POST /api/v1/ticket/users/{userId}/tickets called");

    TicketCreationResponse response = ticketService.createTicket(headerUserId, pathUserId, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  // service desk user routes

  // @Operation(summary = "List all tickets", description = "Retrieves all
  // tickets.")
  @GetMapping("/tickets")
  public List<Ticket> listTickets() {
    System.out.println("GET /api/v1/ticket/tickets called");

    return ticketService.listTickets();
  }

  // @Operation(summary = "Get ticket", description = "Retrieve given ticket.")
  @GetMapping("/tickets/{ticketId}")
  public Ticket getTicket(
      @RequestHeader("X-User-Role") String userRole,
      @RequestHeader("X-User-Id") String userId,
      @PathVariable("ticketId") String ticketId) {
    System.out.println("GET /api/v1/ticket/tickets/{ticketId} called");

    return ticketService.getTicket(userRole, userId, ticketId);
  }

  // @Operation(summary = "Update ticket", description = "Update given ticket.")
  @PatchMapping("/tickets/{ticketId}")
  public Ticket updateTicket(
      @PathVariable("ticketId") String ticketId,
      @RequestBody UpdateTicketRequest request) {
    System.out.println("PATCH /api/v1/ticket/tickets/{ticketId} called");

    return ticketService.updateTicket(ticketId, request);
  }

}
