const ValidationError = require("../helpers/errors/validation");

const checkUniques = async (model, req, res, next) => {
  const { email, phone_number } = req.body;

  const emailExists = await model.getOne({
    where: { email },
    select: { email: true },
  });

  const phoneNumberExists = await model.getOne({
    where: { phone_number },
    select: { phone_number: true },
  });

  if (emailExists && phoneNumberExists) {
    return next(new ValidationError("email and phone number already exist"));
  }

  if (emailExists) {
    return next(new ValidationError("Email already exists"));
  }

  if (phoneNumberExists) {
    return next(new ValidationError("Phone number already exists"));
  }

  next();
};

module.exports = checkUniques;
