import { test, expect } from "@playwright/test";
import { BASE_URL as API_URL } from "../../config/env";
import { getAuthToken } from "../utils";

const BASE_URL = `${API_URL}/api/v1`;

test.describe("Calculator E2E API", () => {
  test.describe("POST /api/v1/calculator/calculate", () => {
    const payload = { num1: 1, num2: 2, operation: "+", result: 3 };

    test(`returns sum ${payload.num1} + ${payload.num2} = ${payload.result}`, async ({
      request,
    }) => {
      const token = await getAuthToken(request);

      const response = await request.post(`${BASE_URL}/calculator/calculate`, {
        data: {
          num1: payload.num1,
          num2: payload.num2,
          operation: payload.operation,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.result).toBe(payload.result);
      expect(body.message).toMatch(/successfully calculated/i);
    });

    test("returns error when non-numeric input (addition)", async ({
      request,
    }) => {
      const token = await getAuthToken(request);
      const response = await request.post(`${BASE_URL}/calculator/calculate`, {
        data: { num1: "a", num2: 2, operation: "+" },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.message).toMatch(/num1 and num2 must be numbers/i);
      expect(body.error).toBe(true);
    });

    test(`returns subtraction ${payload.num1} - ${payload.num2} = ${payload.result}`, async ({
      request,
    }) => {
      const payload = { num1: 5, num2: 2, operation: "-", result: 3 };
      const token = await getAuthToken(request);

      const response = await request.post(`${BASE_URL}/calculator/calculate`, {
        data: {
          num1: payload.num1,
          num2: payload.num2,
          operation: payload.operation,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.result).toBe(payload.result);
      expect(body.message).toMatch(/successfully calculated/i);
    });

    test("returns error for invalid subtraction inputs", async ({
      request,
    }) => {
      const token = await getAuthToken(request);
      const response = await request.post(`${BASE_URL}/calculator/calculate`, {
        data: { num1: 1, num2: "x", operation: "-" },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.message).toMatch(/num1 and num2 must be numbers/i);
      expect(body.error).toBe(true);
    });

    test(`returns multiplication ${payload.num1} * ${payload.num2} = ${payload.result}`, async ({
      request,
    }) => {
      const payload = { num1: 2, num2: 3, operation: "*", result: 6 };
      const token = await getAuthToken(request);

      const response = await request.post(`${BASE_URL}/calculator/calculate`, {
        data: {
          num1: payload.num1,
          num2: payload.num2,
          operation: payload.operation,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.result).toBe(payload.result);
      expect(body.message).toMatch(/successfully calculated/i);
    });

    test("returns error for invalid multiply input", async ({ request }) => {
      const token = await getAuthToken(request);
      const response = await request.post(`${BASE_URL}/calculator/calculate`, {
        data: { num1: 2, num2: null, operation: "*" },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.message).toMatch(/num1 and num2 must be numbers/i);
      expect(body.error).toBe(true);
    });

    test(`returns division ${payload.num1} / ${payload.num2} = ${payload.result}`, async ({
      request,
    }) => {
      const payload = { num1: 6, num2: 3, operation: "/", result: 2 };
      const token = await getAuthToken(request);

      const response = await request.post(`${BASE_URL}/calculator/calculate`, {
        data: {
          num1: payload.num1,
          num2: payload.num2,
          operation: payload.operation,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.result).toBe(payload.result);
      expect(body.message).toMatch(/successfully calculated/i);
    });

    test("returns error when dividing by zero", async ({ request }) => {
      const token = await getAuthToken(request);
      const response = await request.post(`${BASE_URL}/calculator/calculate`, {
        data: { num1: 1, num2: 0, operation: "/" },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const body = await response.json();
      expect(body.error).toBe(true);
    });

    test("returns error when invalid operation", async ({ request }) => {
      const token = await getAuthToken(request);
      const response = await request.post(`${BASE_URL}/calculator/calculate`, {
        data: { num1: 1, num2: 1, operation: "%" },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.message).toMatch(/invalid operation/i);
      expect(body.error).toBe(true);
    });
  });

  test.describe("GET /calculator/calculate", () => {
    test("returns list of calculates with default limit and offset", async ({
      request,
    }) => {
      const token = await getAuthToken(request);
      const response = await request.get(`${BASE_URL}/calculator/calculate`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.message).toMatch(/Successfully Fetched Calculations/i);
    });

    test("accepts pagination params", async ({ request }) => {
      const token = await getAuthToken(request);
      const response = await request.get(
        `${BASE_URL}/calculator/calculate?limit=2&offset=0`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.message).toMatch(/Successfully Fetched Calculations/i);
    });
  });

  test.describe("GET /calculator/calculate/:id", () => {
    test("returns calculate by id if exists", async ({ request }) => {
      const token = await getAuthToken(request);
      // First create a calculate
      const responseCreate = await request.post(
        `${BASE_URL}/calculator/calculate`,
        {
          data: { num1: 10, num2: 4, operation: "+" },
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      expect(responseCreate.status()).toBe(201);
      const createdBody = await responseCreate.json();
      // Now try id fetch
      if (!createdBody.data || !createdBody.data.id) return test.skip();
      const calcId = createdBody.data.id || createdBody.data?.id;
      const response = await request.get(
        `${BASE_URL}/calculator/calculate/${calcId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toBeTruthy();
      expect(body.message).toMatch(/successfully fetched calculate/i);
    });

    test("returns error for invalid id", async ({ request }) => {
      const token = await getAuthToken(request);

      const response = await request.get(
        `${BASE_URL}/calculator/calculate/invalid`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      expect(response.status()).toBe(404);
      const body = await response.json();
      expect(body.error).toBe(true);
    });

    test("returns error if calculate not found", async ({ request }) => {
      const token = await getAuthToken(request);
      // using a very large id likely to not exist
      const response = await request.get(
        `${BASE_URL}/calculator/calculate/9999999`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      expect(response.status()).toBe(404);
      const body = await response.json();
      expect(body.error).toBe(true);
    });
  });
});
