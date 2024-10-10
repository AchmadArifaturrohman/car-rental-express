require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");

const PORT = 3111;
const app = express();
const server = http.createServer(app);
const errorHandler = require("./src/middlewares/errorHandler");
require("./src/helpers/errors");

app.use(express.json()); // Sebagai middleware untuk mengubah req.body menjadi JSON

app.use("/public", express.static(path.join(__dirname, "public")));
require("./src/routes")(app);

app.use((req, res) => {
  res.status(404).send("Sorry, Page Not Found");
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
