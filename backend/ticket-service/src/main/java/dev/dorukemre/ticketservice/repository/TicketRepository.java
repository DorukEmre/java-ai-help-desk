package dev.dorukemre.ticketservice.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.dorukemre.ticketservice.entity.Ticket;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

  public List<Ticket> findByUserId(String userId);
}
