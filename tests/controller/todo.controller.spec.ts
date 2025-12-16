import { test, expect, request as pwRequest } from "@playwright/test";
import { getAuthToken } from "../utils";
import { BASE_URL as API_URL } from "../../config/env";
import { resetDb } from "../utils/reset-db";

const BASE_URL = `${API_URL}/api/v1`;

test.describe("Todo API E2E", () => {
  test.beforeAll(async () => {
    await resetDb("reset_todos");
  });
  // test.beforeEach(async ({}) => {
  //   // Assuming the app provides a way to reset todos, e.g. a special test endpoint
  //   await pwRequest.newContext().then(async (context) => {
  //     await context.post(`${BASE_URL}/todos/reset`);
  //     await context.close();
  //   });
  // });

  test("gets all todos (unauthenticated)", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/todos`);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty("error");
    expect(body).toHaveProperty("message");
  });

  test("gets all todos (authenticated)", async ({ request }) => {
    const token = await getAuthToken(request);
    const response = await request.get(`${BASE_URL}/todos`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      success: true,
      message: expect.stringMatching(/Sucessfully Get All Todos/i),
      data: expect.any(Array),
    });
  });

  test("gets single todo and fails on missing id (authenticated)", async ({
    request,
  }) => {
    const token = await getAuthToken(request);
    // Add a new todo first so you know its id
    const addRes = await request.post(`${BASE_URL}/todos`, {
      data: { title: "Get One", description: "GetOne", completed: false },
      headers: { authorization: `Bearer ${token}` },
    });
    expect(addRes.status()).toBe(201);
    const added = await addRes.json();
    const id = added.data?.id ?? "1";

    const res = await request.get(`${BASE_URL}/todos/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("id", id);

    // Now request a non-existent id
    const missingRes = await request.get(`${BASE_URL}/todos/99999`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missingRes.status()).not.toBe(200);
    const missingBody = await missingRes.json();
    expect(missingBody).toHaveProperty("error");
  });

  // test("adds todos and increases array length (authenticated)", async ({
  //   request,
  // }) => {
  //   const token = await getAuthToken(request);
  //   // Get initial todos
  //   const initialRes = await request.get(`${BASE_URL}/todos`, {
  //     headers: { authorization: `Bearer ${token}` },
  //   });
  //   const initialBody = await initialRes.json();
  //   const initialLength = (initialBody.data || []).length;

  //   const res = await request.post(`${BASE_URL}/todos`, {
  //     data: { title: "New 1", description: "Desc1", completed: false },
  //     headers: { authorization: `Bearer ${token}` },
  //   });
  //   expect(res.status()).toBe(201);
  //   const data = await res.json();
  //   expect(data).toMatchObject({
  //     success: true,
  //     message: "Successfully Created Todo",
  //     data: data.data
  //   });

  //   const finalRes = await request.get(`${BASE_URL}/todos`, {
  //     headers: { authorization: `Bearer ${token}` },
  //   });
  //   const finalBody = await finalRes.json();
  //   expect((finalBody.data || []).length).toBe(initialLength + 1);
  // });

  test("updates todo and fails when id not found (authenticated)", async ({
    request,
  }) => {
    const token = await getAuthToken(request);
    // Create a new todo to update
    const addRes = await request.post(`${BASE_URL}/todos`, {
      data: { title: "Edit Me", description: "desc", completed: false },
      headers: { authorization: `Bearer ${token}` },
    });
    expect(addRes.status()).toBe(201);
    const added = await addRes.json();
    const todoId = added.data?.id || "1";

    const updateRes = await request.put(`${BASE_URL}/todos/${todoId}`, {
      data: { title: "Updated", description: "Updated", completed: true },
      headers: { authorization: `Bearer ${token}` },
    });
    expect(updateRes.status()).toBe(201);
    const updateBody = await updateRes.json();
    expect(updateBody).toMatchObject({
      success: true,
      data: updateBody.data,
      message: "Successfully Updated Todo"
    });

    // Update non-existent
    const missingRes = await request.put(`${BASE_URL}/todos/99999`, {
      data: { title: "Updated", description: "Updated", completed: true },
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missingRes.status()).not.toBe(201);
    const missingBody = await missingRes.json();
    expect(missingBody).toHaveProperty("error");
  });

  test("deletes todo and fails on missing id (authenticated)", async ({
    request,
  }) => {
    const token = await getAuthToken(request);
    // First add a todo to delete
    const addRes = await request.post(`${BASE_URL}/todos`, {
      data: { title: "Delete Me", description: "del", completed: false },
      headers: { authorization: `Bearer ${token}` },
    });
    expect(addRes.status()).toBe(201);
    const added = await addRes.json();
    const todoId = added.data?.id || "1";

    const delRes = await request.delete(`${BASE_URL}/todos/${todoId}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(delRes.status()).toBe(200);
    const delBody = await delRes.json();
    expect(delBody).toMatchObject({
      success: true,
      data: null,
      message: "Successfully Deleted Todo",
    });

    // Try to delete a missing one
    const missingRes = await request.delete(`${BASE_URL}/todos/99999`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missingRes.status()).not.toBe(201);
    const missingBody = await missingRes.json();
    expect(missingBody).toHaveProperty("error");
  });
});
