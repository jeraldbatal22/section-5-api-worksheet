import { test, expect, request } from '@playwright/test';
import { getAuthData } from '../utils';
import { BASE_URL as API_URL } from '../../config/env.config';
import { resetDb } from '../utils/reset-db';

const BASE_URL = `${API_URL}/api/v1`;

test.describe('Bookmark API E2E', () => {
  // test.beforeAll(async () => {
  //   await resetDb('reset_bookmarks');
  // });

  // test.beforeAll(async () => {
  //   // request = await request.newContext();
  //   authData = await getAuthData(request.newContext());
  // });

  test.beforeEach(async () => {
    // Reset database before each test for isolation
    await resetDb('reset_bookmarks');
  });

  // test.afterAll(async () => {
  //   await request.dispose();
  // });

  test('gets all bookmarks (unauthenticated)', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/bookmarks`);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('success', false);
  });

  test('gets all bookmarks (authenticated)', async ({ request }) => {
    const { token } = await getAuthData(request);
    const response = await request.get(`${BASE_URL}/bookmarks`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      success: true,
      message: expect.stringMatching(/Successfully fetched bookmarks/i),
      data: expect.any(Array),
    });
  });

  test('gets single bookmark & fails on missing id (authenticated)', async ({ request }) => {
    const { token } = await getAuthData(request);

    const missingRes = await request.get(`${BASE_URL}/bookmarks/99999999`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missingRes.status()).not.toBe(200);
    const missingBody = await missingRes.json();
    expect(missingBody).toHaveProperty('success', false);
  });

  test('creates bookmark (authenticated)', async ({ request }) => {
    const { token } = await getAuthData(request);

    const data = {
      url: `https://bookmarktest.com/${Date.now()}`,
      title: `Test Bookmark ${Date.now()}`,
    };
    const res = await request.post(`${BASE_URL}/bookmarks`, {
      data,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({
      success: true,
      message: 'Successfully created bookmark',
      data: expect.objectContaining({
        id: expect.anything(),
        url: data.url,
        title: data.title,
      }),
    });
  });

  test('updates bookmark and fails when id not found (authenticated)', async ({ request }) => {
    const { token } = await getAuthData(request);
    // First, create a bookmark to update
    const createRes = await request.post(`${BASE_URL}/bookmarks`, {
      data: { url: 'https://update.com', title: 'Old Title' },
      headers: { authorization: `Bearer ${token}` },
    });
    expect(createRes.status()).toBe(201);
    const bookmark = await createRes.json();
    const bookmarkId = bookmark.data?.id;

    // Update the bookmark
    const updateData = { url: 'https://update.com/updated', title: 'Updated Title' };
    const updateRes = await request.put(`${BASE_URL}/bookmarks/${bookmarkId}`, {
      data: updateData,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody).toMatchObject({
      success: true,
      data: expect.objectContaining({
        id: bookmarkId,
        url: updateData.url,
        title: updateData.title,
      }),
      message: 'Successfully updated bookmark',
    });

    // Try to update a non-existent bookmark
    const missingRes = await request.put(`${BASE_URL}/bookmarks/99999999`, {
      data: updateData,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missingRes.status()).not.toBe(200);
    const missingBody = await missingRes.json();
    expect(missingBody).toHaveProperty('success', false);
  });

  test('deletes bookmark and fails on missing id (authenticated)', async ({ request }) => {
    const { token } = await getAuthData(request);

    // First, create a bookmark to delete
    const createRes = await request.post(`${BASE_URL}/bookmarks`, {
      data: { url: 'https://delete.com', title: 'To Delete' },
      headers: { authorization: `Bearer ${token}` },
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    const bookmarkId = created.data?.id;

    // Delete the bookmark
    const delRes = await request.delete(`${BASE_URL}/bookmarks/${bookmarkId}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(delRes.status()).toBe(200);
    const delBody = await delRes.json();
    expect(delBody).toMatchObject({
      success: true,
      data: null,
      message: 'Successfully Deleted Bookmark',
    });

    // Try to delete a missing one
    const missingRes = await request.delete(`${BASE_URL}/bookmarks/99999999`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missingRes.status()).not.toBe(200);
    const missingBody = await missingRes.json();
    expect(missingBody).toHaveProperty('success', false);
  });

  test('supports pagination on GET /bookmarks', async ({ request }) => {
    const { token } = await getAuthData(request);

    // Create 3 bookmarks
    for (let i = 0; i < 3; ++i) {
      await request.post(`${BASE_URL}/bookmarks`, {
        data: { url: `https://pagi${i}.com`, title: `Page ${i}` },
        headers: { authorization: `Bearer ${token}` },
      });
    }

    // Query with limit
    const res = await request.get(`${BASE_URL}/bookmarks?limit=2&page=1`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('success', true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeLessThanOrEqual(2);
    expect(body).toHaveProperty('meta.pagination');
    expect(body.meta.pagination).toHaveProperty('limit', 2);
    expect(body.meta.pagination).toHaveProperty('page', 1);
  });
});
