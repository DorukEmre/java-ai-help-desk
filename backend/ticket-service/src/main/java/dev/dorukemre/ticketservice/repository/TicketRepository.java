package dev.dorukemre.ticketservice.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.dorukemre.ticketservice.entity.Ticket;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

  // Returns all tickets for a specific user
  public List<Ticket> findAllByUserId(String userId);
}
