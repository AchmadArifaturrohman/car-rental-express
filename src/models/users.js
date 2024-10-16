const BaseModel = require("./index");

// Inheritance

class UserModel extends BaseModel {
  constructor() {
    super("users"); // car dikirim ke BaseModel pada index.js // prisma.cars
    this.select = {
      id: true,
      full_name: true,
      email: true,
      role_id: true,
      address: true,
      gender: true,
      avatar: true,
      phone_number: true,
      driver_license: true,
      birthdate: true,
      created_dt: true,
      updated_dt: true,
      created_by: true,
      updated_by: true,
    };
  }
}
module.exports = UserModel;
