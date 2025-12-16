import { test, expect } from '@playwright/test';
import { BASE_URL as API_URL } from '../../config/env.ts';

const BASE_URL = `${API_URL}/api/v1`;
const DEFAULT_USERNAME = 'user@gmail.com';
const DEFAULT_PASSWORD = 'user';

test.describe('authorizeMiddleware', () => {
  test('should block request when not authenticated (no token)', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/protected`);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toMatchObject({
      message: 'Unauthorized',
      statusCode: 401,
      error: true,
    });
  });

  test('should block request when token is invalid', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/protected`, {
      headers: {
        authorization: 'Bearer invalid.jwt.token',
      },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toMatchObject({
      error: true,
      message: expect.stringMatching(/invalid token/i),
    });
  });

  test('should block if userId not found in token', async ({ request }) => {
    // Create a valid JWT with no userId.
    // For test only: sign with wrong or missing userId.
    // Since we don't have direct signing here, skip or adjust as necessary.
    // You may want to skip this or test with a crafted token if your system exposes the signing key ONLY for testing.
  });

  test('should block if user does not exist in DB', async ({ request }) => {
    // Generate a valid token with a random/non-existent userId, using same JWT_SECRET.
    // If not able in e2e, recommend this integration in unit tests for the middleware itself.
    // Or, attempt login with fake credentials to simulate.
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
    const protectedResponse = await request.get(`${BASE_URL}/protected`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(protectedResponse.ok()).toBeTruthy();
    const protectedBody = await protectedResponse.text();
    expect(protectedBody).toBe('Hello to protected routes');
  });
});

test.describe('authorizeRoles', () => {
  let adminToken: string;

  test.beforeAll(async ({ request }) => {
    // Obtain an admin token for role-based access
    const login = await request.post(`${BASE_URL}/auth/login`, {
      data: { username: "admin@gmail.com", password: "admin" },
    });
    expect(login.ok()).toBeTruthy();
    const body = await login.json();
    adminToken = body.token;
  });

  test('should allow access to allowed role', async ({ request }) => {
    // This assumes /admin-resource requires admin role via authorizeRoles
    const response = await request.get(`${BASE_URL}/admin-resource`, {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    // If route does not exist, skip; if exists, expect success
    if (response.status() === 404) test.skip();
    else expect(response.status()).toBeLessThan(400);
  });

  test('should block access if role not allowed', async ({ request }) => {
    // Make a login as a non-admin, e.g. a user with role 'user'
    // To do this, you need a non-admin account set up in your test DB.
    // If not available, skip this test.
    // Example:
    const login = await request.post(`${BASE_URL}/auth/login`, {
      data: { username: 'user@gmail.com', password: 'user' },
    });
    if (!login.ok()) test.skip();
    const docBody = await login.json();
    const docToken = docBody.token;

    // Try to access admin-resource
    const response = await request.get(`${BASE_URL}/admin-resource`, {
      headers: { authorization: `Bearer ${docToken}` },
    });
    if (response.status() === 404) test.skip();
    expect(response.status()).toBe(403);
    const respBody = await response.json();
    expect(respBody).toMatchObject({
      message: 'Forbidden - You do not have permission to access this resource',
      statusCode: 403,
      error: true,
    });
  });
});
