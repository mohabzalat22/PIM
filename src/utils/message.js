export const successMessage = (
  data,
  statusCode = 200,
  message = "Success",
  meta
) => {
  return {
    success: true,
    statusCode,
    message,
    data,
    meta,
  };
};

export const errorMessage = (
  message = "An error occurred",
  statusCode = 500,
  error = null
) => {
  return {
    success: false,
    statusCode,
    message,
    error,
  };
};
