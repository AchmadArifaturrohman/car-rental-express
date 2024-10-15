const BaseModel = require("./index");

// Inheritance

class RoleModel extends BaseModel {
  constructor() {
    super("roles"); // car dikirim ke BaseModel pada index.js // prisma.cars
    this.select = {
      id: true,
      role: true,
    };
  }
}

module.exports = RoleModel;
