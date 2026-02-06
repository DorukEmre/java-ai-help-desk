import { Col } from "react-bootstrap";

interface Props {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

const IconCol = ({ src, alt, size = 36, className }: Props) => (
  <Col className={`d-flex justify-content-center align-items-center ${className || ""}`}>
    <img src={src} alt={alt} style={{ width: size }} />
  </Col>
);

export default IconCol;
