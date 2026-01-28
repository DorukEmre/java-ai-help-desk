package dev.dorukemre.ticketservice.request;

import java.util.List;

public record ChatCompletionRequest(String model, List<Message> messages) {

  public record Message(
      String role,
      List<Content> content) {
  }

  public sealed interface Content
      permits TextContent, ImageUrlContent {
  }

  public record TextContent(
      String type,
      String text) implements Content {
  }

  public record ImageUrlContent(
      String type,
      ImageUrl image_url) implements Content {
  }

  public record ImageUrl(String url) {
  }
}
