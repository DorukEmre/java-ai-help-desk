import { useEffect, useRef } from 'react';

import { uwConfig } from '@/config/cloudinaryConfig';
import { Button } from 'react-bootstrap';
import { useAuthApi } from '@/hooks/useAuthApi';

// Adapted from:
// https://cloudinary.com/documentation/upload_widget 
// https://stackblitz.com/edit/cloudinary-upload-widget-react


type Props = {
  setPublicId: React.Dispatch<React.SetStateAction<string | null>>
}

const CloudinaryUploadWidget = ({ setPublicId }: Props) => {
  const authApi = useAuthApi();
  const uploadWidgetRef = useRef<{ open: () => void; } | null>(null);
  const uploadButtonRef = useRef<HTMLButtonElement | null>(null);


  useEffect(() => {
    const initializeUploadWidget = async () => {
      if (window.cloudinary && uploadButtonRef.current) {

        // Create upload widget
        uploadWidgetRef.current = window.cloudinary
          .createUploadWidget(
            {
              ...uwConfig,
              api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
              uploadSignature: async (callback: any, paramsToSign: any) => {
                const response = await authApi.post('/cloudinary/signature', {
                  paramsToSign,
                });

                callback(response.data.signature);
              },
            },
            (error: any, result: any) => {
              if (!error && result && result.event === 'success') {
                console.log('Upload successful:', result.info);
                setPublicId(result.info.public_id);
              } else if (error) {
                console.error('Upload error:', error);
              }
            }
          );

        // Add click event to open widget
        const handleUploadClick = () => {
          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open();
          }
        };

        const buttonElement = uploadButtonRef.current;
        buttonElement.addEventListener('click', handleUploadClick);

        // Cleanup
        return () => {
          buttonElement.removeEventListener('click', handleUploadClick);
        };
      }
    };

    initializeUploadWidget();
  }, [uwConfig, setPublicId]);

  return (
    <Button
      variant="secondary"
      ref={uploadButtonRef}
      id="upload_widget"
    >
      Add Image
    </Button>
  );
};

export default CloudinaryUploadWidget;
