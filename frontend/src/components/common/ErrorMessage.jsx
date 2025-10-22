const ErrorMessage = ({error, touched}) => {
  if (!touched || !error) return null;
  return (  
    <p className="text-xs text-red-600 mt-2">{error}</p>
  )
}
export default ErrorMessage