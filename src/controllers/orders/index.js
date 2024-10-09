const Joi = require("joi");

const BaseController = require("../base");
const OrderModel = require("../../models/orders");
const CarModel = require("../../models/cars");

const express = require("express");
const router = express.Router();
const { authorize, checkRole } = require("../../middlewares/authorization");

const orders = new OrderModel();
const cars = new CarModel();

const postOrderSchema = Joi.object({
  car_id: Joi.number().required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().required(),
  is_driver: Joi.boolean().required(),
});

const updateOrderSchema = Joi.object({
  status: Joi.string().required(),
});

const putReturnSchema = Joi.object({
  status: Joi.string().required(),
  end_time: Joi.date().required(),
});

class OrdersController extends BaseController {
  constructor(model) {
    super(model);
    router.get("/", this.getAll);
    router.post(
      "/",
      this.validation(postOrderSchema),
      authorize,
      checkRole(["customer"]),
      this.postOrder
    );
    router.get("/:id", this.get);
    router.put(
      "/:id/return",
      this.validation(putReturnSchema),
      authorize,
      checkRole(["customer"]),
      this.update
    );
    router.put(
      "/:id/payment",
      this.validation(updateOrderSchema),
      authorize,
      checkRole(["customer"]),
      this.update
    );
    router.delete("/:id", authorize, checkRole(["superadmin"]), this.delete);
  }

  postOrder = async (req, res, next) => {
    try {
      const car = await cars.getOne({
        where: { id: req.body.car_id, is_available: true, is_driver: true },
        select: { price: true },
      });
      if (!car) {
        return next(new ValidationError("Car is not available"));
      }

      const getLastOrderToday = await this.model.count({
        created_at: {
          lte: new Date(), // Less than or equal to today
        },
      });

      const startTime = new Date(req.body.start_time);
      const endTime = new Date(req.body.end_time);
      const currentDate = new Date();
      const days = (endTime - startTime) / (1000 * 60 * 60 * 24);
      const total = car.price * days;
      const orderNo = `INV/${currentDate.getFullYear()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getDate()}/${getLastOrderToday + 1}`;

      const [order, carUpdate] = await this.model.transaction([
        this.model.set({
          is_driver: req.body.is_driver,
          total: total,
          order_no: orderNo,
          is_expired: false,
          status: "pending",
          start_time: startTime,
          end_time: endTime,
          created_by: req.user.full_name,
          updated_by: req.user.full_name,
          cars: {
            connect: {
              id: req.body.car_id,
            },
          },
          users: {
            connect: {
              id: req.user.id,
            },
          },
        }),
        cars.update(req.body.car_id, { is_available: false }),
      ]);

      return res.status(201).json(
        this.apiSend({
          code: 201,
          status: "success",
          message: "Order success",
          data: {
            order,
            carUpdate,
          },
        })
      );
    } catch (error) {
      next(new ServerError(error));
    }
  };

  putReturn = async (req, res, next) => {
    try {
      const dataOrder = await this.model.getOne({
        where: { id: req.params.id },
        select: {
          status: true,
          end_time: true,
          total: true,
        },
      });

      const returnTime = new Date(req.body.end_time);
      const endTime = new Date(dataOrder.end_time);
      const fine = 100000; // Denda 100.000 perjam

      const isFine = returnTime > endTime;
      let totalPayment;
      let hours;
      if (isFine) {
        hours = (returnTime - endTime) / (1000 * 60 * 60);
        totalPayment = dataOrder.total + fine * hours;
      } else {
        totalPayment = dataOrder.total;
      }

      const putReturn = await this.model.update(req.params.id, {
        status: "return",
        total: totalPayment,
      });

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Return success",
          data: {
            fine: isFine ? fine * hours : 0,
            description: isFine
              ? `Denda ${fine} perjam x ${hours}`
              : "Tidak ada denda",
            total_payment: totalPayment,
            put_return: putReturn,
          },
        })
      );
    } catch (error) {
      next(new ServerError(error));
    }
  };
}

new OrdersController(orders);

module.exports = router;
