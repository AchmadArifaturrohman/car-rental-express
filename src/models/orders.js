const BaseModel = require("./index");

// Inheritance

class OrderModel extends BaseModel {
  constructor() {
    super("order"); // order dikirim ke BaseModel pada index.js // prisma.order
    this.select = {
      id: true,
      user_id: true,
      car_id: true,
      start_time: true,
      end_time: true,
      total: true,
      is_driver: true,
      is_expired: true,
      status: true,
      created_dt: true,
      updated_dt: true,
    };
  }
}
module.exports = OrderModel;
