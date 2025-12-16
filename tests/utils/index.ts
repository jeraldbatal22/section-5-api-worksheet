import { expect } from "@playwright/test";
import { BASE_URL as API_URL } from "../../config/env";

const BASE_URL = `${API_URL}/api/v1`;
const DEFAULT_USERNAME = "user@gmail.com";
const DEFAULT_PASSWORD = "user";

async function getAuthToken(request: any) {
  const loginRes = await request.post(`${BASE_URL}/auth/login`, {
    data: {
      username: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD,
    },
  });
  expect(loginRes.ok()).toBeTruthy();
  const loginBody = await loginRes.json();
  return loginBody.data.token;
}

export { getAuthToken };
