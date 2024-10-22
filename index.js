const envPath =
  process.env.NODE_ENV === "development"
    ? ".env"
    : `.env.${process.env.NODE_ENV}`;
require("dotenv").config({ path: envPath });
const express = require("express");
const path = require("path");
const cors = require("cors");
const routes = require("./src/routes");
const { PORT = 3111 } = process.env;
const app = express();
const errorHandler = require("./src/middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./api/openapi.json");

require("./src/helpers/errors");

app.use(cors());
app.use(express.json()); // Sebagai middleware untuk mengubah req.body menjadi JSON

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", routes);

app.use((req, res) => {
  res.status(404).send("Sorry, Page Not Found");
});

app.use(errorHandler);

// app.use((req, res, next) => {
//   next(new NotFoundError(null, "Sorry, page not found!"));
// });

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
