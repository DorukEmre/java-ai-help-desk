import { ListGroup } from "react-bootstrap";

interface Props {
  style?: React.CSSProperties;
  label: React.ReactNode;
  value: React.ReactNode;
  noWrapper?: boolean;
  noFlex?: boolean;
}

export const TicketInfoItem = (
  { style, label, value, noWrapper = false, noFlex = false }: Props
) => {

  return (

    <ListGroup.Item as="li"
      style={style}
      className={noFlex ? "" : "d-flex justify-content-between flex-wrap"}
    >
      <span className="fw-bold">{label}</span>
      {noWrapper ? value : <span>{value}</span>}
    </ListGroup.Item>

  );
};
