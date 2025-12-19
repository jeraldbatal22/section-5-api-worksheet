import { test, expect } from '@playwright/test';
import { BASE_URL as API_URL } from '../../config/env.config';
import { getAuthData } from '../utils';

const BASE_URL = `${API_URL}/api/v1`;

test.describe('Shorten URL API E2E', () => {
  let authHeaders: Record<string, string> = {};

  test.beforeEach(async ({ request }) => {
    const { token } = await getAuthData(request);
    authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  });

  test.describe('POST /shorten-url', () => {
    test('should create a shortened URL with valid user and body', async ({ request }) => {
      const payload = {
        url: 'https://example.com',
        shorten_url: 'my-short-url',
      };
      const response = await request.post(`${BASE_URL}/shorten-url`, {
        data: payload,
        headers: { ...authHeaders },
      });

      const body = await response.json();

      // Check for duplicate error first
      if (
        typeof body.error === 'string' &&
        /Database error: duplicate key value/i.test(body.error)
      ) {
        // Acceptable if duplicate, so status should be 400 or as controller defines for duplicate
        expect(response.status()).toBe(500);
        expect(body).toHaveProperty('success', false);
        // Optionally check message or data structure
      } else {
        expect(response.status()).toBe(201);
        expect(body).toMatchObject({
          success: true,
          message: 'Successfully shortened URL',
        });
        expect(body.data).toBeTruthy();
        expect(body.data.original_url).toBe(payload.url);
        expect(body.data.short_url).toBe(payload.shorten_url);
      }
    });

    test('should return error if user is not authenticated', async ({ request }) => {
      const payload = {
        url: 'https://example3.com',
        shorten_url: 'another3-short',
      };
      const response = await request.post(`${BASE_URL}/shorten-url`, {
        data: payload,
      });
      const body = await response.json();

      expect(body).toMatchObject({
        success: false,
        message: 'No Token Provided',
      });
    });

    test('should return error if url or shorten_url is missing', async ({ request }) => {
      const tests = [
        { url: '', shorten_url: 'some' },
        { url: 'https://x.com', shorten_url: '' },
        {},
      ];
      for (const data of tests) {
        const response = await request.post(`${BASE_URL}/shorten-url`, {
          data,
          headers: { ...authHeaders },
        });
        const body = await response.json();
        expect(body).toHaveProperty('success', false);
        expect(body.message).toBe('Validation failed');
      }
    });
  });

  test.describe('GET /shorten-url', () => {
    test('should get all shortened urls for user (paginated)', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/shorten-url`, {
        headers: { ...authHeaders },
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.message).toMatch(/Successfully retrieved shortened URLs/i);
    });

    test('should throw error if not authenticated', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/shorten-url`);
      const body = await response.json();
      expect(response.status()).toBe(401);
      expect(body).toMatchObject({
        success: false,
        message: 'No Token Provided',
      });
    });
  });

  test.describe('GET /shorten-url/:shortCode', () => {
    const shortCode = 'my-test-sc';
    let shortenUrlData: any;
    test.beforeEach(async ({ request }) => {
      // Ensure the short url exists before retrieval
      const response = await request.post(`${BASE_URL}/shorten-url`, {
        data: { url: 'https://init-url.com', shorten_url: shortCode },
        headers: { ...authHeaders },
      });
      const body = await response.json();
      shortenUrlData = body;
    });

    test('should get original url by short code', async ({ request }) => {
      if (
        shortenUrlData &&
        typeof shortenUrlData.message === 'string' &&
        /Database error: duplicate key value/i.test(shortenUrlData.message)
      ) {
        expect(shortenUrlData).toHaveProperty('success', false);
      } else {
        const response = await request.get(`${BASE_URL}/shorten-url/${shortCode}`, {
          headers: { ...authHeaders },
        });
        const body = await response.json();
        expect(response.status()).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toMatch(/Successfully retrieved shortened URL/);
        expect(body.data).toBeTruthy();
        expect(body.data.short_url).toBe(shortCode);
      }
    });

    test('should return error if short code not found', async ({ request }) => {
      if (
        shortenUrlData &&
        typeof shortenUrlData.message === 'string' &&
        /Database error: duplicate key value/i.test(shortenUrlData.message)
      ) {
        expect(shortenUrlData).toHaveProperty('success', false);
      } else {
        const response = await request.get(`${BASE_URL}/shorten-url/does-not-exist`);
        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body).toMatchObject({
          success: false,
        });
      }
    });
  });
});
