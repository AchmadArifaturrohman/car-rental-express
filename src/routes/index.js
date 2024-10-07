const controllers = require("../controllers");

module.exports = function (app) {
  app
    .use("/api/v1/cars", controllers.cars)
    .use("/api/v1/users", controllers.users);
};

// const express = require("express");
// const router = express.Router();
// const controllers = require("../controllers");

// router.get("/api/v1/cars", controllers.cars.getCars);
// router.post("/api/v1/cars", controllers.cars.createCar);
// router.get("/api/v1/cars/:id", controllers.cars.getCarById);
// router.put("/api/v1/cars/:id", controllers.cars.updateCar);
// router.delete("/api/v1/cars/:id", controllers.cars.deleteCar);

// module.exports = router;
