const BaseModel = require("./index");

// Inheritance

class AccessModel extends BaseModel {
  constructor() {
    super("access"); // car dikirim ke BaseModel pada index.js // prisma.cars
    this.select = {
      id: true,
      visible: true,
      role_id: true,
      menu_id: true,
      grant: true,
    };
  }
}

module.exports = AccessModel;
