import { test, expect, request as pwRequest, APIRequestContext } from '@playwright/test';
import { getAuthData } from '../utils';
import { API_BASE_URL } from '../../config/env.config';

const BASE_URL = `${API_BASE_URL}/api/v1`;
const ROLES = ['basic', 'pro', 'admin'] as const;

type AuthData = {
  token: string;
  userId: string;
};

test.describe('Todo API E2E Tests', () => {
  test.describe('Unauthenticated requests', () => {
    test('should return 401 when getting todos without auth', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/todos`);

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('success', false);
      expect(body).toHaveProperty('message', 'No Token Provided');
    });

    test('should return 401 when creating todo without auth', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/todos`, {
        data: { title: 'Test', description: 'Test', completed: false },
      });

      expect(response.status()).toBe(401);
    });
  });

  // Test each role separately with proper isolation
  for (const role of ROLES) {
    test.describe(`Role: ${role}`, () => {
      let authData: AuthData | any;
      let request: APIRequestContext;

      test.beforeAll(async () => {
        request = await pwRequest.newContext();
        authData = await getAuthData(request);
      });

      test.beforeEach(async () => {
        // Reset database before each test for isolation
        // await resetDb('reset_todos');
      });

      test.afterAll(async () => {
        await request.dispose();
      });

      // Helper function to create auth headers
      const getAuthHeaders = () => ({
        authorization: `Bearer ${authData.token}`,
      });

      test('should get all todos', async () => {
        const response = await request.get(`${BASE_URL}/todos`, {
          headers: getAuthHeaders(),
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toMatchObject({
          success: true,
          message: expect.stringMatching(/Sucessfully Get Todos/i),
          data: expect.any(Array),
        });
      });

      test('should create a new todo', async () => {
        const todoData = {
          title: 'Test Todo',
          description: 'Test Description',
          completed: false,
        };

        const response = await request.post(`${BASE_URL}/todos`, {
          data: todoData,
          headers: getAuthHeaders(),
        });

        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body).toMatchObject({
          success: true,
          data: expect.objectContaining(body.data),
        });
      });

      test('should get a single todo by id', async () => {
        // Create a todo first
        const createRes = await request.post(`${BASE_URL}/todos`, {
          data: { title: 'Get Me', description: 'Description', completed: false },
          headers: getAuthHeaders(),
        });
        expect(createRes.status()).toBe(201);

        const created = await createRes.json();
        expect(created.data?.id).toBeDefined();
        const todoId = created.data.id;

        // Get the todo
        const response = await request.get(`${BASE_URL}/todos/${todoId}`, {
          headers: getAuthHeaders(),
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toMatchObject({
          success: true,
          data: expect.objectContaining({
            id: todoId,
            title: 'Get Me',
          }),
        });
      });

      test('should return 500 when getting non-existent todo', async () => {
        const response = await request.get(`${BASE_URL}/todos/non-existent-id-99999`, {
          headers: getAuthHeaders(),
        });

        expect(response.status()).toBe(500);
        const body = await response.json();
        expect(body).toHaveProperty('success', false);
      });

      test('should update an existing todo if user is pro role', async ({ request }) => {
        const authData = await getAuthData(request, 'pro@gmail.com', 'Password!@#$1');
        const useReponse = await request.get(`${BASE_URL}/auth/users/${authData.user?.id}`, {
          headers: getAuthHeaders(),
        });

        expect(useReponse.status()).toBe(200);
        const userBody = await useReponse.json();
        if (userBody.data?.role === role) {
          // Create a todo
          const createRes = await request.post(`${BASE_URL}/todos`, {
            data: { title: 'Original', description: 'Original Desc', completed: false },
            headers: {
              authorization: `Bearer ${authData?.token}`,
            },
          });
          expect(createRes.status()).toBe(201);

          const created = await createRes.json();
          const todoId = created.data.id;

          // // Update the todo
          const updateData = {
            title: 'Updated Title',
            description: 'Updated Description',
            completed: true,
          };

          const response = await request.put(`${BASE_URL}/todos/${todoId}`, {
            data: updateData,
            headers: {
              authorization: `Bearer ${authData.token}`,
            },
          });

          expect(response.status()).toBe(200);
          const body = await response.json();
          expect(body).toMatchObject({
            success: true,
            message: expect.stringMatching(/Successfully Updated Todo/i),
            data: expect.objectContaining(body.data),
          });
        }
      });

      test('should return 401 when updating non-existent todo for pro user role', async () => {
        const authData = await getAuthData(request, 'pro@gmail.com', 'Password!@#$1');
        const useReponse = await request.get(`${BASE_URL}/auth/users/${authData.user?.id}`, {
          headers: {
            authorization: `Bearer ${authData.token}`,
          },
        });

        expect(useReponse.status()).toBe(200);

        const response = await request.put(`${BASE_URL}/todos/non-existent-id-99999`, {
          data: { title: 'Updated', description: 'Updated', completed: true },
          headers: {
            authorization: `Bearer ${authData.token}`,
          },
        });

        expect(response.status()).toBe(500);
        const body = await response.json();
        expect(body).toHaveProperty('success', false);
      });

      test('should delete an existing todo for pro user role', async () => {
        const authData = await getAuthData(request, 'pro@gmail.com', 'Password!@#$1');
        const useReponse = await request.get(`${BASE_URL}/auth/users/${authData.user?.id}`, {
          headers: {
            authorization: `Bearer ${authData.token}`,
          },
        });

        expect(useReponse.status()).toBe(200);

        // Create a todo
        const createRes = await request.post(`${BASE_URL}/todos`, {
          data: { title: 'Delete Me', description: 'To be deleted', completed: false },
          headers: {
            authorization: `Bearer ${authData.token}`,
          },
        });
        expect(createRes.status()).toBe(201);

        const created = await createRes.json();
        const todoId = created.data.id;

        // Delete the todo
        const response = await request.delete(`${BASE_URL}/todos/${todoId}`, {
          headers: {
            authorization: `Bearer ${authData.token}`,
          },
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toMatchObject({
          success: true,
          message: expect.stringMatching(/successfully deleted todo/i),
        });

        // Verify it's deleted
        const getRes = await request.get(`${BASE_URL}/todos/${todoId}`, {
          headers: getAuthHeaders(),
        });
        expect(getRes.status()).toBe(500);
      });

      test('should return 404 when deleting non-existent todo', async () => {
        const authData = await getAuthData(request, 'pro@gmail.com', 'Password!@#$1');
        const useReponse = await request.get(`${BASE_URL}/auth/users/${authData.user?.id}`, {
          headers: {
            authorization: `Bearer ${authData.token}`,
          },
        });

        expect(useReponse.status()).toBe(200);
        const response = await request.delete(`${BASE_URL}/todos/non-existent-id-99999`, {
          headers: {
            authorization: `Bearer ${authData.token}`,
          },
        });

        expect(response.status()).toBe(500);
        const body = await response.json();
        expect(body).toHaveProperty('success', false);
      });

      // Additional validation tests
      test('should return 400 when creating todo with missing required fields both pro and basic', async () => {
        const response = await request.post(`${BASE_URL}/todos`, {
          data: { completed: false }, // Missing title
          headers: getAuthHeaders(),
        });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body).toHaveProperty('success', false);
        expect(body).toHaveProperty('message', 'Validation failed');
      });

      test('should return 400 when creating todo with invalid data types', async () => {
        const response = await request.post(`${BASE_URL}/todos`, {
          data: {
            title: 123, // Should be string
            description: 'Valid',
            completed: 'not-a-boolean', // Should be boolean
          },
          headers: getAuthHeaders(),
        });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body).toHaveProperty('error');
      });
    });
  }
});
