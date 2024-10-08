const { verifyToken } = require("../helpers/jwt");
const UserModel = require("../models/users");
const user = new UserModel();

async function authorize(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      throw new AuthorizationError();
    }
    const token = bearerToken.split(" ")[1];
    const payload = verifyToken(token);

    req.user = await user.getById(payload.id);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

function checkRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError("Forbidden", 403);
    }
    next();
  };
}

module.exports = { authorize, checkRole };
