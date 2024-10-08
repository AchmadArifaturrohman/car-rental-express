const Joi = require("joi");

const BaseController = require("../base");
const CarModel = require("../../models/cars");

const express = require("express");
const router = express.Router();
const { authorize, checkRole } = require("../../middlewares/authorization");
const cars = new CarModel();

const carSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  type: Joi.string(),
  manufacture: Joi.string().required(),
  is_driver: Joi.boolean().required(),
  image: Joi.string().uri().allow(null),
  description: Joi.string().allow(null),
  is_available: Joi.boolean(),
  license_no: Joi.string(),
  seat: Joi.number().min(2),
  baggage: Joi.number(),
  transmission: Joi.string(),
  year: Joi.string(),
});

class CarsController extends BaseController {
  constructor(model) {
    super(model);
    router.get("/", this.getAll);
    router.post(
      "/",
      this.validation(carSchema),
      authorize,
      checkRole(["admin"]),
      this.create
    );
    router.get("/:id", this.get);
    router.put(
      "/:id",
      this.validation(carSchema),
      authorize,
      checkRole(["admin"]),
      this.update
    );
    router.delete("/:id", authorize, checkRole(["superadmin"]), this.delete);
  }
}

new CarsController(cars);

module.exports = router;
