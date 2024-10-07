const bcrypt = require("bcryptjs");
const salt = 10;

/**
 * Encrypts a plaintext password using bcrypt.
 *
 * This asynchronous function takes a plaintext password and generates a secure hashed version
 * using bcrypt's hashing algorithm, which includes a salt to enhance security against attacks.
 *
 * @async
 * @function encryptPassword
 * @param {string} password - The plaintext password to be encrypted.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
async function encryptPassword(password) {
  const result = await bcrypt.hash(password, bcrypt.genSaltSync(salt));
  return result;
}

/**
 * Compares a plaintext password with an encrypted password.
 *
 * This asynchronous function uses bcrypt to verify if the provided plaintext password
 * matches the given encrypted password, returning a boolean result.
 *
 * @async
 * @function checkPassword
 * @param {string} password - The plaintext password to be checked.
 * @param {string} encryptedPassword - The encrypted password to compare against.
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
 */
async function checkPassword(password, encryptedPassword) {
  const result = await bcrypt.compare(password, encryptedPassword);
  return result;
}

module.exports = { encryptPassword, checkPassword };
