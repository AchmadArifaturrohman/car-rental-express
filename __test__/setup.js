const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const server = require("../index");

// beforeAll(async () => {
//   await prisma.users.deleteMany();
//   await prisma.access.deleteMany();
//   await prisma.cars.deleteMany();
//   await prisma.menus.deleteMany();
//   await prisma.roles.deleteMany();
//   await prisma.order.deleteMany();
// });

afterAll(async () => {
  await prisma.users.deleteMany();
  await prisma.access.deleteMany();
  await prisma.cars.deleteMany();
  await prisma.menus.deleteMany();
  await prisma.roles.deleteMany();
  await prisma.order.deleteMany();

  server.close();

  console.log("End of tests");
});
