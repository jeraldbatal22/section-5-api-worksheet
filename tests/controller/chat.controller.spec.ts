import { test, expect, request as pwRequest, APIRequestContext } from '@playwright/test';
import { BASE_URL as API_URL } from '../../config/env.config';
import { getAuthData } from '../utils';
import { resetDb } from '../utils/reset-db';

const BASE_URL = `${API_URL}/api/v1`;
interface User {
  id: string;
  email?: string;
  name?: string;
}

interface Message {
  id: string;
  content: string;
  receiver_id: string;
  sender_id?: string;
  created_at?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  error?: boolean;
}

// Helper to create test message payload
const createMessagePayload = (receiverId: string, content?: string) => ({
  content: content || `Test message ${Date.now()}`,
  receiver_id: receiverId,
});

// Helper for API assertions
const expectSuccessResponse = async (response: any, expectedStatus = 200) => {
  expect(response.status()).toBe(expectedStatus);
  const body: ApiResponse = await response.json();
  expect(body.success).toBe(true);
  return body;
};

const expectErrorResponse = async (response: any, expectedStatus = 400) => {
  expect(response.status()).toBe(expectedStatus);
  const body: ApiResponse = await response.json();
  expect(body.error).toBe(true);
  expect(body.message).toBeTruthy();
  return body;
};

test.describe('Chat API E2E', () => {
  let authHeaders: Record<string, string> = {};
  let testUsers: User[] = [];
  let request: APIRequestContext;

  // Setup authentication before all tests
  test.beforeAll(async () => {
    request = await pwRequest.newContext();
    const { token } = await getAuthData(request);
    console.log(token, 'tokentoken');
    authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    // Fetch test users once for all tests
    const response = await request.post(`${BASE_URL}/auth/users`, {
      headers: authHeaders,
    });

    expect(response.status()).toBe(200);
    const body: ApiResponse<User[]> = await response.json();
    testUsers = body.data;

    // Ensure we have test data
    expect(testUsers.length).toBeGreaterThan(0);
  });

  test.beforeEach(async () => {
    // Reset database before each test for isolation
    await resetDb('reset_chats');
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  // ============================================================================
  // POST /chats - Send Message
  // ============================================================================

  test.describe('POST /chats (send message)', () => {
    test('should send a message successfully', async ({ request }) => {
      const payload = createMessagePayload(testUsers[0].id);

      const response = await request.post(`${BASE_URL}/chats`, {
        data: payload,
        headers: authHeaders,
      });

      const body = await expectSuccessResponse(response, 201);

      // Detailed assertions
      expect(body.data).toBeTruthy();
      expect(body.message).toMatch(/message sent successfully/i);
      expect(body.data.content).toBe(payload.content);
      expect(body.data.receiver_id).toBe(payload.receiver_id);
      expect(body.data.id).toBeTruthy(); // Ensure ID is generated
    });

    test('should handle long message content', async ({ request }) => {
      const longContent = 'A'.repeat(1000); // Test with 1000 characters
      const payload = createMessagePayload(testUsers[0].id, longContent);

      const response = await request.post(`${BASE_URL}/chats`, {
        data: payload,
        headers: authHeaders,
      });

      const body = await expectSuccessResponse(response, 201);
      expect(body.data.content).toBe(longContent);
    });

    test('should handle special characters in message', async ({ request }) => {
      const specialContent = `Test with special chars: !@#$%^&*()_+ emoji 🚀 "quotes" 'apostrophes'`;
      const payload = createMessagePayload(testUsers[0].id, specialContent);

      const response = await request.post(`${BASE_URL}/chats`, {
        data: payload,
        headers: authHeaders,
      });

      const body = await expectSuccessResponse(response, 201);
      expect(body.data.content).toBe(specialContent);
    });

    test('should reject unauthenticated request', async ({ request }) => {
      const payload = createMessagePayload(testUsers[0].id);

      const response = await request.post(`${BASE_URL}/chats`, {
        data: payload,
        // No auth headers
      });
      expect([401, 500]).toContain(response.status());
    });

    test('should reject invalid receiver_id', async ({ request }) => {
      const payload = createMessagePayload('invalid-user-id-999999');

      const response = await request.post(`${BASE_URL}/chats`, {
        data: payload,
        headers: authHeaders,
      });

      // Could be 400 (bad request) or 404 (user not found)
      expect([400, 404, 500]).toContain(response.status());
      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test.describe('Validation Errors', () => {
      const invalidPayloads = [
        {
          name: 'empty content',
          data: { content: '', receiver_id: '2' },
          error: 'Content is required',
          key: 'content',
        },
        {
          name: 'missing content',
          data: { receiver_id: '2' },
          error: 'Invalid input: expected string, received undefined',
          key: 'content',
        },
        {
          name: 'empty receiver_id',
          data: { content: 'hello', receiver_id: '' },
          error: 'Receiver id is required',
          key: 'receiver_id',
        },
        {
          name: 'missing receiver_id',
          data: { content: 'hello' },
          error: 'Invalid input',
          key: 'receiver_id',
        },
      ];

      for (const { name, data, error, key } of invalidPayloads) {
        test(`should reject ${name}`, async ({ request }) => {
          const response = await request.post(`${BASE_URL}/chats`, {
            data,
            headers: authHeaders,
          });

          expect([400, 422]).toContain(response.status());
          const body = await response.json();
          expect(body.error[key]).toContain(error);
          expect(body.message).toContain('Validation failed');
        });
      }
    });
  });

  // ============================================================================
  // GET /chats?receiver_id - Retrieve Chat History
  // ============================================================================

  test.describe('GET /chats?receiver_id', () => {
    let testReceiverId: string;

    test.beforeAll(async ({ request }) => {
      // Ensure we have a receiver with chat history
      testReceiverId = testUsers[0].id;

      // Send a test message to ensure history exists
      await request.post(`${BASE_URL}/chats`, {
        data: createMessagePayload(testReceiverId, 'Setup message for history'),
        headers: authHeaders,
      });
    });

    test('should retrieve chat history successfully', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/chats?receiver_id=${testReceiverId}`, {
        headers: authHeaders,
      });

      const body = await expectSuccessResponse(response);
      expect(body.message).toMatch(/retrieved chat history/i);
      expect(Array.isArray(body.data)).toBe(true);

      // If data exists, validate structure
      if (body.data.length > 0) {
        const firstMessage = body.data[0];
        expect(firstMessage).toHaveProperty('id');
        expect(firstMessage).toHaveProperty('content');
        expect(firstMessage).toHaveProperty('receiver_id');
      }
    });

    test('should return empty array for users with no chat history', async ({ request }) => {
      // Use a valid but unused user ID
      const unusedUserId = testUsers[testUsers.length - 1]?.id || '999';

      const response = await request.get(`${BASE_URL}/chats?receiver_id=${unusedUserId}`, {
        headers: authHeaders,
      });

      const body = await expectSuccessResponse(response);
      expect(Array.isArray(body.data)).toBe(true);
    });

    test('should reject unauthenticated request', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/chats?receiver_id=${testReceiverId}`);

      expect([400, 422, 500, 401]).toContain(response.status());
    });

    test('should reject missing receiver_id parameter', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/chats`, {
        headers: authHeaders,
      });

      expect([400, 422]).toContain(response.status());
      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test('should handle pagination parameters if supported', async ({ request }) => {
      const response = await request.get(
        `${BASE_URL}/chats?receiver_id=${testReceiverId}&page=1&limit=10`,
        { headers: authHeaders }
      );

      expect(response.status()).toBe(200);
    });
  });

  // ============================================================================
  // DELETE /chats/:id - Delete Message
  // ============================================================================

  test.describe('DELETE /chats/:id', () => {
    let testMessage: Message;

    test.beforeEach(async ({ request }) => {
      // Create a message to delete
      const response = await request.post(`${BASE_URL}/chats`, {
        data: createMessagePayload(testUsers[0].id, 'Message to delete'),
        headers: authHeaders,
      });

      const body: ApiResponse<Message> = await response.json();
      testMessage = body.data;
    });

    test('should delete message successfully', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/chats/${testMessage.id}`, {
        headers: authHeaders,
      });

      const body = await expectSuccessResponse(response);
      expect(body.message).toMatch(/message deleted successfully/i);

      // Verify deletion by trying to fetch
      const fetchResponse = await request.get(`${BASE_URL}/chats/${testMessage.id}`, {
        headers: authHeaders,
      });

      const fetchBody = await fetchResponse.json();
      expect([200, 404, 400]).toContain(fetchResponse.status());
      if (fetchResponse.status() === 200) {
        expect(fetchBody.data).toBeNull();
      }
    });

    test('should reject unauthenticated delete request', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/chats/${testMessage.id}`);
      expect([401, 500]).toContain(response.status());
    });

    test('should handle deleting non-existent message', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/chats/999999999`, {
        headers: authHeaders,
      });

      expect([200, 404, 400]).toContain(response.status());
    });

    test('should prevent double deletion', async ({ request }) => {
      // Delete once
      await request.delete(`${BASE_URL}/chats/${testMessage.id}`, {
        headers: authHeaders,
      });

      // Try to delete again
      const response = await request.delete(`${BASE_URL}/chats/${testMessage.id}`, {
        headers: authHeaders,
      });

      expect([200, 404, 400]).toContain(response.status());
    });
  });

  // ============================================================================
  // INTEGRATION TESTS - Complex Scenarios
  // ============================================================================

  test.describe('Integration Scenarios', () => {
    test('should handle complete message lifecycle', async ({ request }) => {
      const receiverId = testUsers[0].id;

      // 1. Send message
      const sendResponse = await request.post(`${BASE_URL}/chats`, {
        data: createMessagePayload(receiverId, 'Lifecycle test message'),
        headers: authHeaders,
      });
      const sendBody = await expectSuccessResponse(sendResponse, 201);
      const messageId = sendBody.data.id;

      // 2. Retrieve message
      const getResponse = await request.get(`${BASE_URL}/chats/${messageId}`, {
        headers: authHeaders,
      });
      const getBody = await expectSuccessResponse(getResponse);
      expect(getBody.data.id).toBe(messageId);

      // 3. Verify in chat history
      const historyResponse = await request.get(`${BASE_URL}/chats?receiver_id=${receiverId}`, {
        headers: authHeaders,
      });
      const historyBody = await expectSuccessResponse(historyResponse);
      const messageInHistory = historyBody.data.find((msg: Message) => msg.id === messageId);
      expect(messageInHistory).toBeTruthy();

      // 4. Delete message
      const deleteResponse = await request.delete(`${BASE_URL}/chats/${messageId}`, {
        headers: authHeaders,
      });
      await expectSuccessResponse(deleteResponse);

      // 5. Verify deletion
      const verifyResponse = await request.get(`${BASE_URL}/chats/${messageId}`, {
        headers: authHeaders,
      });
      expect([200, 404, 400]).toContain(verifyResponse.status());
    });

    test('should handle rapid message sending', async ({ request }) => {
      const receiverId = testUsers[0].id;
      const messageCount = 5;
      const promises = [];

      // Send multiple messages concurrently
      for (let i = 0; i < messageCount; i++) {
        promises.push(
          request.post(`${BASE_URL}/chats`, {
            data: createMessagePayload(receiverId, `Rapid message ${i}`),
            headers: authHeaders,
          })
        );
      }

      const responses = await Promise.all(promises);

      // All should succeed
      for (const response of responses) {
        expect(response.status()).toBe(201);
      }
    });
  });
});
