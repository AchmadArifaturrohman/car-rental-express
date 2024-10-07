const Joi = require("joi");

const BaseController = require("../base");
const UserModel = require("../../models/users");
const users = new UserModel();
const express = require("express");
const router = express.Router();

const userSchema = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  address: Joi.string().required(),
  gender: Joi.string().required(),
  avatar: Joi.string().uri().allow(null),
  phone_number: Joi.string().required(),
  driver_license: Joi.string().allow(null),
  birthdate: Joi.date().allow(null),
});

class UsersController extends BaseController {
  constructor(model) {
    super(model);
    router.get("/", this.getAll);
    router.post(
      "/",
      this.validation(userSchema),
      this.checkUnique,
      this.encryptPass,
      this.create
    );
    router.get("/:id", this.get);
    router.put(
      "/:id",
      this.validation(userSchema),
      this.checkUnique,
      this.update
    );
    router.delete("/:id", this.delete);
  }
}
new UsersController(users);

module.exports = router;
