const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

/**
 * Creates a JSON Web Token (JWT) from the provided payload.
 *
 * This function encodes the given payload into a JWT using a secret key,
 * setting an expiration time of 30 minutes. The generated token can be used
 * for secure authentication and authorization in web applications.
 *
 * @param {Object} payload - The data to be included in the JWT, typically user information or claims.
 * @returns {string} The signed JWT as a string, which can be sent to clients for authentication.
 */
function createToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1800s" });
}

/**
 * Verifies a JSON Web Token (JWT) and decodes its payload.
 *
 * This function checks the validity of the provided token using a secret key.
 * If the token is valid, it returns the decoded payload; otherwise, it throws an error.
 *
 * @param {string} token - The JWT to be verified.
 * @returns {Object} The decoded payload of the JWT if verification is successful.
 * @throws {JsonWebTokenError} If the token is invalid or expired.
 */
function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  createToken,
  verifyToken,
};
