import { test, expect } from "@playwright/test";
import { BASE_URL as API_URL } from "../../config/env";
import { getAuthToken } from "../utils";

const BASE_URL = `${API_URL}/api/v1`;

test.describe("Chat API E2E", () => {
  // let authHeaders: Record<string, string> = {};

  // test.beforeEach(async ({ request }) => {
  //   const AUTH_TOKEN = await getAuthToken(request);
  //   authHeaders = AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {};
  // });

  // test.describe("POST /chats (send message)", () => {
  //   let users: any = [];
  //   test.beforeAll(async ({ request }) => {
  //     const response = await request.post(`${BASE_URL}/auth/users`, {
  //       headers: { ...authHeaders },
  //     });

  //     expect(response.status()).toBe(200);
  //     const body = await response.json();
  //     users = body.data;
  //   });

  //   test("should send a message successfully when authenticated", async ({
  //     request,
  //   }) => {
  //     if (users.length > 0) {
  //       // The ids here must exist - adjust as per your seeding/test data!
  //       const messagePayload = {
  //         content: "Hello from playwright",
  //         receiver_id: users[0].id,
  //         // uploadTo: "chat",
  //       };

  //       const response = await request.post(`${BASE_URL}/chats`, {
  //         data: messagePayload,
  //         headers: { ...authHeaders },
  //       });

  //       expect(response.status()).toBe(201);
  //       const body = await response.json();
  //       expect(body.success).toBe(true);
  //       expect(body.data).toBeTruthy();
  //       expect(body.message).toMatch(/Message sent successfully/i);
  //       expect(body.data.content).toBe(messagePayload.content);
  //       expect(body.data.receiver_id).toBe(messagePayload.receiver_id);
  //     }
  //   });

  //   test("should fail to send message if not authenticated", async ({
  //     request,
  //   }) => {
  //     const payload = {
  //       content: "Fail unauth",
  //       receiver_id: "2",
  //       uploadTo: "chat",
  //     };
  //     const response = await request.post(`${BASE_URL}/chats`, {
  //       data: payload,
  //     });
  //     expect(response.status()).toBe(401);
  //     const body = await response.json();
  //     expect(body).toHaveProperty("error", true);
  //     expect(body).toHaveProperty("message");
  //   });

  //   test("should fail if receiver_id or content is missing", async ({
  //     request,
  //   }) => {
  //     const tests = [
  //       { content: "", receiver_id: "2" },
  //       { content: "hi", receiver_id: "" },
  //       {},
  //     ];
  //     for (const data of tests) {
  //       const response = await request.post(`${BASE_URL}/chats`, {
  //         data,
  //         headers: { ...authHeaders },
  //       });
  //       // Accept any input error, ideally status 400
  //       expect([400, 422]).toContain(response.status());
  //       const body = await response.json();
  //       expect(body).toHaveProperty("error", true);
  //     }
  //   });
  // });

  // test.describe("GET /chatss?receiver_id", () => {
  //   test("should retrieve chat history with another user", async ({
  //     request,
  //   }) => {
  //     // Ensure there's at least one valid message/user pair for this test's user
  //     const receiver_id = "2";
  //     const response = await request.get(
  //       `${BASE_URL}/chatss?receiver_id=${receiver_id}`,
  //       {
  //         headers: { ...authHeaders },
  //       }
  //     );
  //     expect(response.status()).toBe(200);
  //     const body = await response.json();
  //     expect(body.success).toBe(true);
  //     // data may be empty, but always array or null
  //     expect(body.message).toMatch(/retrieved chat history/i);
  //   });

  //   test("should fail to retrieve messages if not authenticated", async ({
  //     request,
  //   }) => {
  //     const receiver_id = "2";
  //     const response = await request.get(
  //       `${BASE_URL}/chatss?receiver_id=${receiver_id}`
  //     );
  //     expect(response.status()).toBe(401);
  //     const body = await response.json();
  //     expect(body).toHaveProperty("error", true);
  //     expect(body).toHaveProperty("message");
  //   });

  //   test("should fail if receiver_id is missing", async ({ request }) => {
  //     const response = await request.get(`${BASE_URL}/chatss`, {
  //       headers: { ...authHeaders },
  //     });
  //     expect([400, 422]).toContain(response.status());
  //     const body = await response.json();
  //     expect(body).toHaveProperty("error", true);
  //   });
  // });

  // test.describe("GET /chats/:id", () => {
  //   let createdMsg: any;
  //   test.beforeEach(async ({ request }) => {
  //     // Create a message to read
  //     const res = await request.post(`${BASE_URL}/chats`, {
  //       data: {
  //         content: "for single fetch",
  //         receiver_id: "2",
  //       },
  //       headers: { ...authHeaders },
  //     });
  //     createdMsg = (await res.json()).data;
  //   });

  //   test("should fetch a message by id", async ({ request }) => {
  //     // createdMsg should exist from beforeEach
  //     const response = await request.get(`${BASE_URL}/chats/${createdMsg.id}`, {
  //       headers: { ...authHeaders },
  //     });
  //     expect(response.status()).toBe(200);
  //     const body = await response.json();
  //     expect(body.success).toBe(true);
  //     expect(body.data).toBeTruthy();
  //     expect(body.data.id).toBe(createdMsg.id);
  //     expect(body.message).toMatch(/retrieved message/i);
  //   });

  //   test("should fail to fetch by id if not authenticated", async ({
  //     request,
  //   }) => {
  //     const response = await request.get(`${BASE_URL}/chats/${createdMsg.id}`);
  //     expect(response.status()).toBe(401);
  //     const body = await response.json();
  //     expect(body).toHaveProperty("error", true);
  //     expect(body).toHaveProperty("message");
  //   });

  //   test("should return 404/not found for non-existent message id", async ({
  //     request,
  //   }) => {
  //     const response = await request.get(`${BASE_URL}/chats/999999`, {
  //       headers: { ...authHeaders },
  //     });
  //     // Could be 404 or always 200 with data: null
  //     expect([200, 404]).toContain(response.status());
  //     const body = await response.json();
  //     if (response.status() === 200) {
  //       expect(body.success).toBe(true);
  //       expect(body.data).toBeNull();
  //     } else {
  //       expect(body).toHaveProperty("error", true);
  //     }
  //   });
  // });

  // test.describe("DELETE /chats/:id", () => {
  //   let createdMsg: any;

  //   test.beforeEach(async ({ request }) => {
  //     // Create a message to delete
  //     const res = await request.post(`${BASE_URL}/chats`, {
  //       data: {
  //         content: "to delete",
  //         receiver_id: "2",
  //       },
  //       headers: { ...authHeaders },
  //     });
  //     createdMsg = (await res.json()).data;
  //   });

  //   test("should delete a message by id", async ({ request }) => {
  //     const response = await request.delete(
  //       `${BASE_URL}/chats/${createdMsg.id}`,
  //       {
  //         headers: { ...authHeaders },
  //       }
  //     );
  //     expect(response.status()).toBe(200);
  //     const body = await response.json();
  //     expect(body.success).toBe(true);
  //     expect(body.data).toBeNull();
  //     expect(body.message).toMatch(/message deleted successfully/i);
  //   });

  //   test("should fail to delete a message if not authenticated", async ({
  //     request,
  //   }) => {
  //     const response = await request.delete(
  //       `${BASE_URL}/chats/${createdMsg.id}`
  //     );
  //     expect(response.status()).toBe(401);
  //     const body = await response.json();
  //     expect(body).toHaveProperty("error", true);
  //     expect(body).toHaveProperty("message");
  //   });

  //   test("should return 404/not found when deleting non-existent message", async ({
  //     request,
  //   }) => {
  //     const response = await request.delete(`${BASE_URL}/chats/999999`, {
  //       headers: { ...authHeaders },
  //     });
  //     // Could be 404 or always 200 with data: null
  //     expect([200, 404]).toContain(response.status());
  //     const body = await response.json();
  //     if (response.status() === 200) {
  //       expect(body.success).toBe(true);
  //     } else {
  //       expect(body).toHaveProperty("error", true);
  //     }
  //   });
  // });
});
