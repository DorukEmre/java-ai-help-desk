import { CloseButton } from "react-bootstrap"

type Props = {
  imagePreviewUrl: string;
  onDelete: () => void;
}

export const ImagePreview = ({ imagePreviewUrl, onDelete }: Props) => {

  return (
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
          onClick={onDelete}
          aria-label="Delete image"
        />
      </div>
    </div>
  )
}