const { generateUsername } = require("unique-username-generator");

function randomUsername(name) {
  return generateUsername("-", 4, 15, name);
}

module.exports = randomUsername;
