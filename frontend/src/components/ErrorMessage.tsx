import axios from "axios";
import { useRef, useEffect } from "react";

export const ErrorMessage = ({ error }: { error: unknown }) => {

  const errorRef = useRef<HTMLParagraphElement>(null);

  // Extract error message
  const message: string | null = (() => {
    if (!error)
      return null;
    if (axios.isAxiosError(error))
      return (error.response?.data?.message as string) ?? error.message;
    if (error instanceof Error)
      return error.message;

    return String(error);
  })();

  // Scroll page to error message
  useEffect(() => {
    if (message && errorRef.current) {
      const element = errorRef.current.getBoundingClientRect().top + window.scrollY;
      const adjustedScrollPosition = element - 90;
      window.scrollTo({ top: adjustedScrollPosition, behavior: 'smooth' });
    }
  }, [message]);

  if (!message)
    return null;

  return (
    <>
      {error && (
        <p
          ref={errorRef}
          className="bg-danger px-3 py-2 m-2 rounded"
          style={{ width: "max-content" }}
        >
          {message}
        </p>
      )}
    </>
  )
}
