import supertest, { SuperTest, Test } from "supertest";
import sequelize from "../data";
import app from "../app";
import { Messages as ErrorMessages } from "../lib/errors";
import { ErrorMessages as ValidationErrorMessages } from "../models/Courier";

const { Courier } = sequelize.models;

describe("Couriers", () => {
  let testApp: SuperTest<Test>;

  beforeAll(async () => {
    await sequelize.sync();
    testApp = supertest(app);
  });

  beforeEach(async () => {
    await Courier.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("GET /couriers/:id", () => {
    test("Non-existent ID", async () => {
      const response = await testApp
        .get("/couriers/111")
        .set("Accept", "application/json")
        .expect(404)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({ message: ErrorMessages.CourierNotFound });
    });

    test("Valid ID", async () => {
      const courier = await Courier.create({
        id: 123,
        available_capacity: 10,
        max_capacity: 10
      });
      const response = await testApp
        .get("/couriers/123")
        .set("Accept", "application/json")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toMatchObject({
        id: courier.get("id"),
        available_capacity: courier.get("available_capacity"),
        max_capacity: courier.get("max_capacity")
      });
    });
  });

  describe("POST /couriers", () => {
    test("Correctly creates and returns new courier", async () => {
      const data = {
        id: 1234,
        max_capacity: 45
      };
      const response = await testApp
        .post("/couriers")
        .set("Accept", "application/json")
        .send(data)
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body).toMatchObject({
        ...data,
        available_capacity: data.max_capacity
      });
    });

    test("Fails when courier already exists", async () => {
      const data = {
        id: 1234,
        max_capacity: 45
      };
      await Courier.create({ ...data, available_capacity: data.max_capacity });
      const response = await testApp
        .post("/couriers")
        .set("Accept", "application/json")
        .send(data)
        .expect(422)
        .expect("Content-Type", /json/);

      expect(response.body).toMatchObject({ message: /id must be unique/ });
    });

    test("Validation Error if max_capacity is less than zero", async () => {
      const data = {
        id: 12345,
        max_capacity: -10
      };
      const response = await testApp
        .post("/couriers")
        .set("Accept", "application/json")
        .send(data)
        .expect(422)
        .expect("Content-Type", /json/);

      expect(response.body).toMatchObject({
        message: new RegExp(ValidationErrorMessages.MaxGTZero)
      });
    });
  });

  describe("PATCH /couriers/:id", () => {
    test("Correctly updates and returns the courier", async () => {
      const courier = await Courier.create({
        id: 999,
        available_capacity: 45,
        max_capacity: 45
      });
      const data = {
        available_capacity: 30
      };
      const response = await testApp
        .patch(`/couriers/${courier.get("id")}`)
        .set("Accept", "application/json")
        .send(data)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toMatchObject({
        id: courier.get("id"),
        max_capacity: courier.get("max_capacity"),
        available_capacity: data.available_capacity
      });
    });
  });
});
