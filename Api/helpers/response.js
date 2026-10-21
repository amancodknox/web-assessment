class ApiError extends Error {
  constructor(status, error, message, data) {
    super(message);
    this.status = status;
    this.error = error;
    this.data = data;
  }
}

module.exports = {
  ApiError,
  BadRequest: (message = 'Bad request', data) => new ApiError(400, 'BAD_REQUEST', message, data),
  ValidationError: (message = 'Validation error', data) => new ApiError(400, 'VALIDATION_ERROR', message, data),
  Unauthorized: (message = 'Unauthorized') => new ApiError(401, 'UNAUTHORIZED', message),
  NotFound: (message = 'Not found') => new ApiError(404, 'NOT_FOUND', message)
};
