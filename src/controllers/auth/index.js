const Joi = require("joi");

const BaseController = require("../base");
const UserModel = require("../../models/users");
const users = new UserModel();
const express = require("express");
const router = express.Router();
const { checkPassword } = require("../../helpers/bcrypt");
const { createToken } = require("../../helpers/jwt");
const randomUsername = require("../../helpers/randomUsername");

const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "string.required": "Email is required.",
  }),
  password: Joi.string().required(),
});

const signUpSchema = Joi.object({
  full_name: Joi.string().optional(),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "string.required": "Email is required.",
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .messages({
      "string.required": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  role: Joi.string().optional(),
});

class AuthController extends BaseController {
  constructor(model) {
    super(model);
    router.post("/signin", this.validation(signInSchema), this.signIn);
    router.post(
      "/signup",
      this.validation(signUpSchema),
      this.checkUnique,
      this.encryptPass,
      this.signUp
    );
  }

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.model.getOne({ where: { email } });
      if (!user)
        return next(new ValidationError({ message: "User not found" }));

      const isMatch = await checkPassword(password, user.password);
      if (!isMatch)
        return next(
          new ValidationError({ message: "Invalid email or password" })
        );

      const token = createToken({ id: user.id });

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "User signed in successfully",
          data: {
            user: {
              ...user,
              id: undefined,
              password: undefined,
            },
            token,
          },
        })
      );
    } catch (error) {
      next(new ServerError(error));
    }
  };

  signUp = async (req, res, next) => {
    try {
      const user = {
        ...req.body,
        role_id: 3,
        full_name: req.body.full_name || randomUsername(),
      };
      const newUser = await this.model.set(user);
      return res.status(201).json(
        this.apiSend({
          code: 201,
          status: "success",
          message: "Signup success",
          data: {
            user: {
              ...newUser,
              id: undefined,
              password: undefined,
            },
          },
        })
      );
    } catch (error) {
      next(new ServerError(error));
    }
  };
}
new AuthController(users);

module.exports = router;
