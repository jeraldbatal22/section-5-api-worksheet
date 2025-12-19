import { test, expect } from '@playwright/test';
import { BASE_URL as API_URL } from '../../config/env.config.ts';

const BASE_URL = `${API_URL}/api/v1`;
const DEFAULT_USERNAME = 'pro@gmail.com';
const DEFAULT_PASSWORD = 'Password!@#$1';

test.describe('authorizeMiddleware', () => {
  test('should block request when not authenticated (no token)', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/todos`);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toMatchObject({
      success: false,
      message: 'No Token Provided',
    });
  });

  test('should block request when token is invalid', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/todos`, {
      headers: {
        authorization: 'Bearer invalid.jwt.token',
      },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toMatchObject({
      success: false,
      message: expect.stringMatching(/unauthorized/i),
    });
  });

  test('should allow request when authenticated and user exists', async ({ request }) => {
    // Login to get a valid token
    const loginResponse = await request.post(`${BASE_URL}/auth/login`, {
      data: { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD },
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginBody = await loginResponse.json();
    const token = loginBody.data.token;
    expect(token).toBeDefined();

    // Access protected route using the valid token
    const protectedResponse = await request.get(`${BASE_URL}/todos`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(protectedResponse.ok()).toBeTruthy();
  });
});

test.describe('authorizeRoles', () => {
  let adminToken: string;

  test.beforeAll(async ({ request }) => {
    // Obtain an admin token for role-based access
    const login = await request.post(`${BASE_URL}/auth/login`, {
      data: { username: 'admin@gmail.com', password: 'admin' },
    });
    expect(login.ok()).toBeTruthy();
    const body = await login.json();
    adminToken = body.token;
  });
});
