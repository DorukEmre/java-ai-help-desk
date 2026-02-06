import { Card, Col, Container, Image, ListGroup, Row } from "react-bootstrap"

import architecture from "@/assets/architecture_diagram.jpg";
import iconAmazon from "@/assets/amazon.svg";
import iconBootstrap from "@/assets/bootstrap.svg";
import iconCaddy from "@/assets/caddyserver.png";
import iconGithub from "@/assets/github.svg";
import iconDocker from "@/assets/docker.svg";
import iconPollinations from "@/assets/pollinations.png";
import iconReact from "@/assets/react.svg";
import iconSpringBoot from "@/assets/spring_boot.svg";
import iconTypescript from "@/assets/typescript.png";
import IconCol from "@/components/IconCol";


function HomePage() {

  return (
    <>
      <h1 className="visually-hidden">Home</h1>

      <Container>

        <h2 className="mb-4 page-section-title">Help Desk Application</h2>

        <Card className="mb-5 shadow-sm mx-0 mx-sm-4">
          <Card.Body className="p-0">
            <ListGroup variant="flush">
              <ListGroup.Item>Create and track support tickets</ListGroup.Item>
              <ListGroup.Item>Assign tickets to agents</ListGroup.Item>
              <ListGroup.Item>Update ticket status (open, in progress, closed)</ListGroup.Item>
              <ListGroup.Item>Track detailed ticket actions</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        <h2 className="mb-4 page-section-title">The Tech</h2>

        <Row className="mb-5 g-4 justify-content-center">

          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Header as="h3">Frontend</Card.Header>
              <ListGroup variant="flush" className="flex-grow-1">
                <ListGroup.Item>Built with React and TypeScript, styled with Bootstrap.</ListGroup.Item>
              </ListGroup>
              <Card.Body className="flex-grow-0">
                <Row>
                  <IconCol src={iconReact} alt="React" />
                  <IconCol src={iconTypescript} alt="TypeScript" />
                  <IconCol src={iconBootstrap} alt="Bootstrap" />
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Header as="h3">Backend</Card.Header>
              <ListGroup variant="flush" className="flex-grow-1">
                <ListGroup.Item>Microservices-based Java Spring Boot backend, all containerised with Docker.</ListGroup.Item>
                <ListGroup.Item>AI-driven automation simplifies ticket classification and handling.</ListGroup.Item>
              </ListGroup>
              <Card.Body className="flex-grow-0">
                <Row>
                  <IconCol src={iconSpringBoot} alt="Spring Boot" />
                  <IconCol src={iconDocker} alt="Docker" />
                  <IconCol src={iconPollinations} alt="Pollinations.ai" />
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Header as="h3">Deployment & CI/CD</Card.Header>
              <ListGroup variant="flush" className="flex-grow-1">
                <ListGroup.Item>Caddy serves the frontend and reverse proxies API requests to an API Gateway.</ListGroup.Item>
                <ListGroup.Item>Cloud deployment on AWS EC2 with CI/CD via GitHub Actions.</ListGroup.Item>
              </ListGroup>
              <Card.Body className="flex-grow-0">
                <Row>
                  <IconCol src={iconCaddy} alt="Caddy" />
                  <IconCol src={iconAmazon} alt="Amazon Web Services" />
                  <IconCol src={iconGithub} alt="Github" />
                </Row>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        <h2 className="mb-4 page-section-title">Application Architecture</h2>

        <Image src={architecture} rounded />

      </Container >

    </>
  )
}

export default HomePage
