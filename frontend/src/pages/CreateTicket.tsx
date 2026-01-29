import { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Badge, Button, CloseButton, Container, Form, Spinner } from "react-bootstrap";

import { ErrorMessage } from "@/components/ErrorMessage";

import { useAuth } from "@/auth/useAuth";
import { useAuthApi } from "@/hooks/useAuthApi";
import type { TicketCreationRequest, TicketCreationResponse } from "@/types/ticket";
import { uploadToCloudinary } from "@/helper/uploadToCloudinary";

const CreateTicket = () => {
  const authApi = useAuthApi();
  const { user } = useAuth();

  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [ticket, setTicket] = useState<TicketCreationResponse | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    let cloudinaryPublicId: string | null = null;

    try {
      if (image) {

        if (!image.type.startsWith('image/')) {
          throw new Error('Only image files are allowed.');
        }

        // Validate file size
        const MAX_SIZE_BYTES = 2 * 1024 * 1024;
        if (image.size > MAX_SIZE_BYTES) {
          throw new Error(`File size exceeds 2 MB limit.`);
        }

        cloudinaryPublicId = await uploadToCloudinary({ file: image, authApi });
      }

    } catch (uploadError: unknown) {
      console.error("Cloudinary upload failed", uploadError);

      if (uploadError instanceof Error)
        setError("Image upload failed: " + uploadError.message);
      else
        setError("Image upload failed. Please try again.");


      setIsLoading(false);
      return;
    }

    try {

      const createTicketUrl = `/users/${user?.id}/tickets`;

      const requestData: TicketCreationRequest = {
        description,
        cloudinaryPublicId
      };
      const response = await authApi.post(createTicketUrl, requestData);
      console.log("Ticket created:", response.data);

      setTicket(response.data);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        console.error("Unexpected error:", error);
        setError('An unexpected error occurred.');
      }

    } finally {
      setIsLoading(false);
    }
  };

  const resetTicket = () => {
    setTicket(null);
    setDescription('');
    setImage(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
  };

  const handleLoadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);

      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  }

  const handleDeleteImage = () => {

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImage(null);
    setImagePreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <>
      <h1 className="visually-hidden">Create Ticket</h1>

      <ErrorMessage error={error} />

      {ticket ? (

        // Show ticket after successful creation
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

        // Show create ticket form
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
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleLoadImage}
            />
          </Form.Group>

          {image && imagePreviewUrl && (
            // Show image preview
            <div className="mb-3" style={{ height: "200px" }}>
              <div
                className="position-relative h-100 mx-auto"
                style={{ height: "200px", maxWidth: "fit-content" }}
              >
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="rounded h-100 mx-auto"
                  style={{ maxHeight: '100%', objectFit: "contain" }}
                />
                <CloseButton
                  className="m-1 p-2 position-absolute top-0 end-0 bg-light"
                  onClick={handleDeleteImage}
                  aria-label="Delete image"
                />
              </div>
            </div>
          )}

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
