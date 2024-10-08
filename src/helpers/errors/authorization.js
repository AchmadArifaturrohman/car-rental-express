class AuthorizationError extends Error {
  constructor(message = "Authorization Error", statusCode = 401) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = AuthorizationError;
