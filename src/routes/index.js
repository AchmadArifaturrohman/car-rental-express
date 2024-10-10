const controllers = require("../controllers");

module.exports = function (app) {
  app
    .use("/api/v1/cars", controllers.cars)
    .use("/api/v1/users", controllers.users)
    .use("/api/v1/auth", controllers.auth)
    .use("/api/v1/orders", controllers.orders)
    .use("/api/v1/upload", controllers.upload);
};
