import { useEffect, useRef, useState } from "react";

import { Form } from "react-bootstrap";

import { useAuth } from "@/auth/useAuth";
import { uploadToCloudinary, validateImage } from "@/helper/imageUpload";
import { useAuthApi } from "@/hooks/useAuthApi";
import type { TicketCreationRequest, TicketCreationResponse } from "@/types/ticket";

import { ImagePreview } from "@/components/ImagePreview";
import { RequestButton } from "@/components/RequestButton";

type Props = {
  setTicket: React.Dispatch<React.SetStateAction<TicketCreationResponse | null>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
  resetKey: number;
}

export const TicketCreateForm = ({ setTicket, setError, resetKey, }: Props) => {

  const authApi = useAuthApi();
  const { user } = useAuth();

  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<{ file: File; previewUrl: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => { // reset form
    setDescription('');
    resetImage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {

      let cloudinaryPublicId: string | null = null;

      if (image && validateImage(image.file))
        cloudinaryPublicId = await uploadToCloudinary(image.file, authApi);

      const url = `/users/${user?.id}/tickets`;

      const requestData: TicketCreationRequest = {
        description,
        cloudinaryPublicId
      };
      const response = await authApi.post(url, requestData);
      console.log("Ticket created:", response.data);

      setTicket(response.data);

    } catch (error: unknown) {
      if (error instanceof Error)
        setError(error.message);
      else
        setError("An unexpected error occurred");

    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadImage = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files && e.target.files.length > 0) {
      const file: File = e.target.files[0];
      const url: string = URL.createObjectURL(file);

      setImage({ file, previewUrl: url });
    }
  }

  const resetImage = () => {

    if (image?.previewUrl)
      URL.revokeObjectURL(image.previewUrl);

    setImage(null);

    if (fileInputRef.current)
      fileInputRef.current.value = "";
  }

  return (

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

      {image?.previewUrl && (
        <ImagePreview
          imagePreviewUrl={image.previewUrl}
          onDelete={resetImage}
        />
      )}

      <RequestButton
        variant="primary"
        type="submit"
        disabled={isLoading}
        isLoading={isLoading}
        style={{ width: "145px" }}
      >
        Create Ticket
      </RequestButton>

    </Form>
  )
}
