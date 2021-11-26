import supertest, { SuperTest, Test } from "supertest";
import app from "../app";

describe("App", () => {
  let testApp: SuperTest<Test>;

  beforeAll(() => {
    testApp = supertest(app);
  });

  test("Catch All Not Found Error", async () => {
    const response = await testApp.get("/").expect(404).expect("Content-Type", /json/);

    expect(response.body).toEqual({ message: "Route Not Found" });
  });
});
