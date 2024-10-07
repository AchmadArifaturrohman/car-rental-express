const { encryptPassword } = require("../helpers/bcrypt");

const encrypt = async (req, res, next) => {
  const encryptedPassword = await encryptPassword(req.body.password);
  req.body.password = encryptedPassword;
  next();
};

module.exports = encrypt;
