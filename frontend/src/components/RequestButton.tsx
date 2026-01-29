import type { ReactNode } from "react";
import { Button, Spinner } from "react-bootstrap";
import type { ButtonProps } from "react-bootstrap";

type Props = {
  isLoading: boolean;
  children: ReactNode;
} & ButtonProps;

export const RequestButton = (
  { isLoading, disabled, children, ...props }: Props
) => {
  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
    >
      {children}{" "}
      {isLoading && (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="ms-1"
          />
          <span className="visually-hidden">Loading...</span>
        </>
      )}
    </Button>
  );
};
