const ErrorMessage = ({ error }) =>
  error && (
    <div className="absolute top-4 left-4 rounded bg-red-600 px-4 py-2">
      {error}
    </div>
  );

export default ErrorMessage;
