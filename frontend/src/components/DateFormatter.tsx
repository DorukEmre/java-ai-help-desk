
type Props = {
  date: string;
  className?: string;
  noWrapper?: boolean;
}

export const DateFormatter = ({ date, className, noWrapper = false }: Props) => {

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const formattedDate = new Date(date).toLocaleString(undefined, options);

  return (
    <>
      {
        noWrapper
          ? formattedDate
          : <small className={className}>{formattedDate}</small>
      }
    </>
  )
}