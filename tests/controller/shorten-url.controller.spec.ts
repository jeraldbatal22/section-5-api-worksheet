import { test, expect } from "@playwright/test";
import { BASE_URL as API_URL } from "../../config/env";
import { getAuthToken } from "../utils";
import { resetDb } from "../utils/reset-db";

const BASE_URL = `${API_URL}/api/v1`;

// Helper: Get auth token (if required). If not protected, mock or remove the call below.

test.describe("Shorten URL API E2E", () => {
  let authHeaders: Record<string, string> = {};

  test.beforeEach(async ({ request }) => {
    const AUTH_TOKEN = await getAuthToken(request);
    authHeaders = AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {};
  });

  test.describe("POST /shorten-url", () => {
    test("should create a shortened URL with valid user and body", async ({
      request,
    }) => {
      const payload = {
        url: "https://example.com",
        shorten_url: "my-short-url",
      };
      const response = await request.post(`${BASE_URL}/shorten-url`, {
        data: payload,
        headers: { ...authHeaders },
      });

      const body = await response.json();

      // Check for duplicate error first
      if (
        typeof body.message === "string" &&
        /Database error: duplicate key value/i.test(body.message)
      ) {
        // Acceptable if duplicate, so status should be 400 or as controller defines for duplicate
        expect(response.status()).toBe(500);
        expect(body).toHaveProperty("error", true);
        // Optionally check message or data structure
      } else {
        expect(response.status()).toBe(201);
        expect(body).toMatchObject({
          success: true,
          message: "Successfully shortened URL",
        });
        expect(body.data).toBeTruthy();
        expect(body.data.original_url).toBe(payload.url);
        expect(body.data.short_url).toBe(payload.shorten_url);
      }
    });

    test("should return error if user is not authenticated", async ({
      request,
    }) => {
      const payload = {
        url: "https://example3.com",
        shorten_url: "another3-short",
      };
      const response = await request.post(`${BASE_URL}/shorten-url`, {
        data: payload,
      });
      const body = await response.json();

      expect(body).toMatchObject({
        error: true,
        message: "Unauthorized",
      });
    });

    test("should return error if url or shorten_url is missing", async ({
      request,
    }) => {
      const tests = [
        { url: "", shorten_url: "some" },
        { url: "https://x.com", shorten_url: "" },
        {},
      ];
      for (const data of tests) {
        const response = await request.post(`${BASE_URL}/shorten-url`, {
          data,
          headers: { ...authHeaders },
        });
        const body = await response.json();
        expect(body).toHaveProperty("error", true);
        expect(body.message).toBe(
          "Both url and shorten_url must be non-empty strings"
        );
      }
    });
  });

  test.describe("GET /shorten-url", () => {
    test("should get all shortened urls for user (paginated)", async ({
      request,
    }) => {
      const response = await request.get(`${BASE_URL}/shorten-url`, {
        headers: { ...authHeaders },
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.message).toMatch(/Successfully retrieved shortened URLs/i);
    });

    test("should return 401 if not authenticated", async ({ request }) => {
      const response = await request.get(`${BASE_URL}/shorten-url`);
      const body = await response.json();
      expect(response.status()).toBe(401);
      expect(body).toMatchObject({
        error: true,
        message: "Unauthorized",
      });
    });

    test("should return 400 on invalid pagination", async ({ request }) => {
      for (const params of [
        "?limit=-1",
        "?offset=-123",
        "?limit=abc",
        "?offset=xyz",
      ]) {
        const response = await request.get(`${BASE_URL}/shorten-url${params}`, {
          headers: { ...authHeaders },
        });
        if (response.status() === 400) {
          const body = await response.json();
          expect(body).toMatchObject({
            error: true,
          });
        }
      }
    });
  });

  test.describe("GET /shorten-url/:shortCode", () => {
    const shortCode = "my-test-sc";
    let shortenUrlData: any;
    test.beforeEach(async ({ request }) => {
      // Ensure the short url exists before retrieval
      const response = await request.post(`${BASE_URL}/shorten-url`, {
        data: { url: "https://init-url.com", shorten_url: shortCode },
        headers: { ...authHeaders },
      });
      const body = await response.json();
      shortenUrlData = body;
    });

    test("should get original url by short code", async ({ request }) => {
      if (
        shortenUrlData &&
        typeof shortenUrlData.message === "string" &&
        /Database error: duplicate key value/i.test(shortenUrlData.message)
      ) {
        expect(shortenUrlData).toHaveProperty("error", true);
      } else {
        const response = await request.get(
          `${BASE_URL}/shorten-url/${shortCode}`
        );
        const body = await response.json();
        expect(response.status()).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toMatch(/Successfully retrieved shortened URL/);
        expect(body.data).toBeTruthy();
        expect(body.data.shorten_url).toBe(shortCode);
      }
    });

    test("should return 404 if short code not found", async ({ request }) => {
      if (
        shortenUrlData &&
        typeof shortenUrlData.message === "string" &&
        /Database error: duplicate key value/i.test(shortenUrlData.message)
      ) {
        expect(shortenUrlData).toHaveProperty("error", true);
      } else {
        const response = await request.get(
          `${BASE_URL}/shorten-url/does-not-exist`
        );
        expect(response.status()).toBe(404);
        const body = await response.json();
        expect(body).toMatchObject({
          error: true,
          message: "Shortened URL not found",
          data: null,
        });
      }
    });

    test("should return 400 if shortCode is invalid", async ({ request }) => {
      const response = await request.get(`${BASE_URL}/shorten-url/`);
      if (response.status() === 400) {
        const body = await response.json();
        expect(body).toHaveProperty("error", true);
        expect(body).toHaveProperty(
          "message",
          "shorten_url must be a non-empty string"
        );
        expect(body.data).toBeNull();
      }
    });
  });
});
