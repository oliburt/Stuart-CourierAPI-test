import { ValidationError } from "sequelize/dist";
import {
  isCustomError,
  CourierNotFound,
  Messages,
  InternalServerError,
  CustomValidationError
} from "../lib/errors";

class MockResponse {
  values: any;
  constructor() {
    this.values = {};
  }
  status(status: number) {
    this.values.status = status;
    return this;
  }

  json(jsonObj: any) {
    this.values.json = jsonObj;
    return this;
  }
}

describe("Errors", () => {
  describe("isCustomError", () => {
    test("returns true if error implements Custom Error interface", () => {
      const error = new CourierNotFound();
      expect(isCustomError(error)).toBe(true);
    });

    test("returns false for other errors", () => {
      const error = new Error("Test Error");
      expect(isCustomError(error)).toBe(false);
    });
  });

  describe("Custom Errors extends Error", () => {
    const error = new CourierNotFound();

    test("instanceof Error", () => {
      expect(error).toBeInstanceOf(Error);
    });

    test("has message attached", () => {
      expect(error.message).toBe(Messages.CourierNotFound);
    });
  });

  describe("Custom Errors implement send", () => {
    test("CourierNotFound", () => {
      const error = new CourierNotFound();
      const res = new MockResponse();
      error.send(res);
      expect(res.values).toEqual({
        status: 404,
        json: { message: Messages.CourierNotFound }
      });
    });

    test("InternalServerError", () => {
      const error = new InternalServerError();
      const res = new MockResponse();
      error.send(res);
      expect(res.values).toEqual({
        status: 500,
        json: { message: Messages.InternalServerError }
      });
    });

    test("CustomValidationError", () => {
      const mockValidationError = new ValidationError("TEST");
      const error = new CustomValidationError(mockValidationError);
      const res = new MockResponse();
      error.send(res);
      expect(res.values).toMatchObject({
        status: 422,
        json: { message: /Validation Error/ }
      });
    });
  });
});
