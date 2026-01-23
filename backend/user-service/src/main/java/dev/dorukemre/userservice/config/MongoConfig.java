package dev.dorukemre.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
public class MongoConfig {

  @Bean
  public MongoClient mongoClient(Environment env) {
    return MongoClients.create(env.getRequiredProperty("spring.data.mongodb.uri"));
  }

  @Bean
  public MongoDatabaseFactory mongoDatabaseFactory(
      MongoClient mongoClient,
      Environment env) {
    return new SimpleMongoClientDatabaseFactory(
        mongoClient,
        env.getRequiredProperty("spring.data.mongodb.database"));
  }
}
