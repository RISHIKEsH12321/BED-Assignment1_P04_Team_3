const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Output file for the spec
const routes = ["./index.js"]; // Path to your API route files

const doc = {
  info: {
    title: "AgriDynamic",
    description: "Test All Admin and User Routes",
  },
  host: "localhost:3000", // Replace with your actual host if needed
};

swaggerAutogen(outputFile, routes, doc);