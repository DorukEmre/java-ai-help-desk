import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';

import { Badge, Button, Container, Form, Spinner } from "react-bootstrap";

import { cld } from "@/config/cloudinaryConfig";
import CloudinaryUploadWidget from '@/components/CloudinaryUploadWidget';

import { useAuth } from "@/auth/useAuth";
import { useAuthApi } from "@/hooks/useAuthApi";
import type { TicketCreationRequest, TicketCreationResponse } from "@/types/ticket";
import { Error } from "@/components/Error";

const CreateTicket = () => {
  const authApi = useAuthApi();
  const { user } = useAuth();

  const [description, setDescription] = useState<string>('');
  const [ticket, setTicket] = useState<TicketCreationResponse | null>(null);
  const [cloudinaryIdPublicId, setCloudinaryIdPublicId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {

      const url = `/users/${user?.id}/tickets`;

      const requestData: TicketCreationRequest = {
        description,
        cloudinaryIdPublicId
      };
      const response = await authApi.post(url, requestData);
      console.log("Ticket created:", response.data);

      setTicket(response.data);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred.');
        console.error("Unexpected error:", error);
      }

    } finally {
      setIsLoading(false);
    }
  };

  const resetTicket = () => {
    setTicket(null);
    setDescription('');
    setCloudinaryIdPublicId('');
    setError(null);
  };

  const handleDeleteImage = () => {

    setCloudinaryIdPublicId(null);

    // implement removal from cloudinary

  }

  return (
    <>
      <h1 className="visually-hidden">Create Ticket</h1>

      <Error error={error} />

      {ticket ? (
        <Container style={{ maxWidth: "800px" }}>
          <div className="d-flex justify-content-between align-items-center mx-auto mb-3" style={{ maxWidth: '366px' }}>
            <p>Ticket successfully created</p>
            <Button variant="primary" type="button" onClick={resetTicket}>
              New Ticket
            </Button>
          </div>
          <div className="border border-secondary p-2 rounded d-flex justify-content-between align-items-start">

            <div className="ms-2 me-auto">
              <Link className="fw-bold text-body d-block" to={`/tickets/${ticket.id}`}>
                {ticket.description}
              </Link>
            </div>

            <div className="text-end">
              <Badge bg="secondary" className="mb-1">{ticket.status.toLocaleLowerCase()}</Badge>
              <div>
                <small>{new Date(ticket.createdAt).toLocaleString()}</small>
              </div>
            </div>

          </div>
        </Container >
      ) : (
        // Show form
        <Form onSubmit={handleSubmit} className="w-100 mx-auto" style={{ maxWidth: '366px' }}>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required />
          </Form.Group>

          <Form.Group className="mb-3 d-flex flex-column gap-2" controlId="formImage">

            {!cloudinaryIdPublicId && (
              <>
                <Form.Label className="visually-hidden">Select Image</Form.Label>
                <Form.Control
                  as={CloudinaryUploadWidget}
                  setPublicId={setCloudinaryIdPublicId}
                  required
                />
              </>
            )}

            {cloudinaryIdPublicId && (
              <>
                <Form.Label className="align-self-start">Image</Form.Label>
                <div
                  className="position-relative align-self-center"
                  style={{ height: '200px' }}
                >
                  <Button
                    className="m-1 position-absolute top-0 end-0 btn btn-danger"
                    onClick={handleDeleteImage}>
                    X
                  </Button>
                  <AdvancedImage
                    className="rounded h-100"
                    style={{ maxHeight: '100%' }}
                    cldImg={cld.image(cloudinaryIdPublicId)}
                    plugins={[responsive(), placeholder()]}
                  />
                </div>
              </>
            )}

          </Form.Group>

          <Button variant="primary" type="submit" disabled={isLoading}>
            Create Ticket{' '}
            {isLoading && (
              <>
                <Spinner as="span"
                  animation="border" size="sm" role="status" aria-hidden="true"
                />
                <span className="visually-hidden">Loading...</span>
              </>
            )}
          </Button>
        </Form>


      )}

    </>
  );
}

export default CreateTicket
