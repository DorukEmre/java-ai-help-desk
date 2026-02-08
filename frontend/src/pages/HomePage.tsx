import { Card, Col, Container, Image, ListGroup, Row } from "react-bootstrap"

import {
  architectureDiagram,
  iconAmazon, iconBootstrap, iconCaddy, iconDocker, iconGithub, iconJava,
  iconPollinations, iconReact, iconSpringBoot, iconTypescript,
} from "@/assets/index"

import IconCol from "@/components/IconCol";


function HomePage() {

  return (
    <>
      <h1 className="visually-hidden">Home</h1>

      <Container>

        <section className="mb-5">

          <h2 className="mb-5 page-section-title">Help Desk Application</h2>

          <Card className="shadow-sm mx-0 mx-sm-4">
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item>Create and track support tickets</ListGroup.Item>
                <ListGroup.Item>Assign tickets to agents</ListGroup.Item>
                <ListGroup.Item>Update ticket status (open, in progress, closed)</ListGroup.Item>
                <ListGroup.Item>Track detailed ticket actions</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

        </section>


        <section className="mb-5">

          <h2 className="mb-5 page-section-title">Application Architecture</h2>

          <Image src={architectureDiagram} rounded />

        </section>


        <section className="mb-5">

          <h2 className="mb-5 page-section-title">The Tech</h2>

          <Row className="g-4 justify-content-center">

            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header as="h3">Frontend</Card.Header>
                <ListGroup variant="flush" className="flex-grow-1">
                  <ListGroup.Item>Built with React and TypeScript, styled with Bootstrap</ListGroup.Item>
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
                  <ListGroup.Item>Microservices-based Java Spring Boot backend</ListGroup.Item>
                  <ListGroup.Item>All services containerised with Docker</ListGroup.Item>
                </ListGroup>
                <Card.Body className="flex-grow-0">
                  <Row>
                    <IconCol src={iconJava} alt="Java" />
                    <IconCol src={iconSpringBoot} alt="Spring Boot" />
                    <IconCol src={iconDocker} alt="Docker" />
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header as="h3">AI-Integration</Card.Header>
                <ListGroup variant="flush" className="flex-grow-1">
                  <ListGroup.Item>AI-powered image processing via Pollinations.ai to simplify ticket classification and handling</ListGroup.Item>
                </ListGroup>
                <Card.Body className="flex-grow-0">
                  <Row>
                    <IconCol src={iconPollinations} alt="Pollinations.ai" />
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header as="h3">Deployment & CI/CD</Card.Header>
                <ListGroup variant="flush" className="flex-grow-1">
                  <ListGroup.Item>Caddy serves the frontend and reverse proxies API requests to an API Gateway</ListGroup.Item>
                  <ListGroup.Item>Cloud deployment on AWS EC2 with CI/CD via GitHub Actions</ListGroup.Item>
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

        </section>

        <section className="mb-5">

          <h2 className="mb-5 page-section-title">View the Code</h2>

          <div className="d-flex align-items-center">

            <img src={iconGithub} height="28" alt="GitHub" className="me-2" />

            <p>
              Explore the full source code for{" "}
              <a
                href="https://github.com/dorukEmre/java-ai-help-desk"
                target="_blank"
                rel="noreferrer"
                aria-label="View on GitHub"
                title="View on GitHub"
                style={{ textDecoration: "underline" }}
              >
                this project on GitHub
              </a>.
            </p>

          </div>

        </section>

      </Container >

    </>
  )
}

export default HomePage
