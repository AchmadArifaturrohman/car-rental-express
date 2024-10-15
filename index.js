require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const routes = require("./src/routes");
const PORT = 3111;
const app = express();
const server = http.createServer(app);
const errorHandler = require("./src/middlewares/errorHandler");
require("./src/helpers/errors");

app.use(cors());
app.use(express.json()); // Sebagai middleware untuk mengubah req.body menjadi JSON

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/v1", routes);

app.use((req, res) => {
  res.status(404).send("Sorry, Page Not Found");
});
app.use(errorHandler);

// app.use((req, res, next) => {
//   next(new NotFoundError(null, "Sorry, page not found!"));
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
