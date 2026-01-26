export const Error = ({ error }: { error: string | null }) => {

  return (
    <>
      {error && (
        <p className="bg-danger px-3 py-2 m-2 rounded" style={{ width: "max-content" }}>{error}</p>
      )}
    </>
  )
}
