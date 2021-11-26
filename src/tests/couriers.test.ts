import supertest, { SuperTest, Test } from "supertest";
import Courier from "../models/Courier";
import sequelize from "../data";
import app from "../app";

describe("Couriers", () => {
  let testApp: SuperTest<Test>;

  beforeAll(async () => {
    await sequelize.sync();
    testApp = supertest(app);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("GET /couriers/:id", () => {
    test("works", async () => {
      const courier = await Courier.create({
        id: 123,
        max_capacity: 10
      });
      const response = await testApp
        .get("/couriers/123")
        .set("Accept", "application/json")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toMatchObject({
        id: courier.get("id"),
        max_capacity: courier.get("max_capacity")
      });
    });
  });
});
