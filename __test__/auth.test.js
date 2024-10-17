const request = require("supertest");
const server = require("../index");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const testUser = {
  email: "test@gmail.com",
  password: "Password@123",
};

const authRoute = "/api/v1/auth";
const signupRoute = `${authRoute}/signup`;
const signinRoute = `${authRoute}/signin`;

describe(`POST ${signupRoute}`, () => {
  it("should return 201 status code", (done) => {
    request(server)
      .post(signupRoute)
      .send(testUser)
      .set("Accept", "application/json")
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toEqual(
          expect.objectContaining({
            code: 201,
            status: "success",
            message: "Signup success",
            data: expect.objectContaining({
              user: {
                full_name: response.body.data.user.full_name,
                email: response.body.data.user.email,
                address: null,
                gender: null,
                avatar: null,
                phone_number: null,
                driver_license: null,
                birthdate: null,
                role_id: 3,
                created_dt: expect.any(String),
                updated_dt: expect.any(String),
                created_by: null,
                updated_by: null,
              },
            }),
          })
        );
        done();
      })
      .catch((error) => {
        console.log("error :", error);
        done(error);
      });
  });
});

describe(`POST ${signinRoute}`, () => {
  it("should return 200 status code", (done) => {
    request(server)
      .post(signinRoute)
      .send(testUser)
      .set("Accept", "application/json")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
          expect.objectContaining({
            code: 200,
            status: "success",
            message: "User signed in successfully",
            data: expect.objectContaining({
              user: {
                full_name: response.body.data.user.full_name,
                email: response.body.data.user.email,
                address: null,
                gender: null,
                avatar: null,
                phone_number: null,
                driver_license: null,
                birthdate: null,
                role_id: 3,
                created_dt: expect.any(String),
                updated_dt: expect.any(String),
                created_by: null,
                updated_by: null,
              },
              token: expect.any(String),
            }),
          })
        );
        done();
      })
      .catch((error) => {
        console.log("error :", error);
        done(error);
      });
  });
});
