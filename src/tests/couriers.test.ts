import supertest, { SuperTest, Test } from "supertest";

import app from "../app";

describe("Couriers", () => {
  let testApp: SuperTest<Test>;

  beforeAll(async () => {
    testApp = supertest(app);
  });

  describe("GET /couriers/:id", () => {
    test("works", async () => {
      const response = await testApp
        .get("/couriers/123")
        .set("Accept", "application/json")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({ id: 123, capacity: 10 });
    });
  });
});
