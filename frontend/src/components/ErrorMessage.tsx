import { useRef, useEffect } from "react";

export const ErrorMessage = ({ error }: { error: string | null }) => {

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      const element = errorRef.current.getBoundingClientRect().top + window.scrollY;
      const adjustedScrollPosition = element - 90;
      window.scrollTo({ top: adjustedScrollPosition, behavior: 'smooth' });
    }
  }, [error]);

  return (
    <>
      {error && (
        <p
          ref={errorRef}
          className="bg-danger px-3 py-2 m-2 rounded"
          style={{ width: "max-content" }}
        >
          {error}
        </p>
      )}
    </>
  )
}
