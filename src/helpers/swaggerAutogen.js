const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Car Rental API",
    description: "API for Car Rental System",
  },
  host: "localhost:3111/api/v1",
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const outputFile = "../../api/swagger-autogen.json";
const routes = ["../../index.js"];

swaggerAutogen(outputFile, routes, doc);
