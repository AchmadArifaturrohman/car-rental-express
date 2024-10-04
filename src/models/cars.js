const BaseModel = require("./index");

// Inheritance

class CarModel extends BaseModel {
    constructor() {
        super("cars"); // car dikirim ke BaseModel pada index.js // prisma.cars
        this.select = {
            id: true,
            name: true,
            manufacure: true,
            image: true,
            year: true,
            price: true,
        }
    }
}

module.exports = CarModel;

