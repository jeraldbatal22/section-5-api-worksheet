import { expect } from "@playwright/test";
import { BASE_URL as API_URL } from "../../config/env";

const BASE_URL = `${API_URL}/api/v1`;
const DEFAULT_USERNAME = "user@gmail.com";
const DEFAULT_PASSWORD = "user";

async function getAuthToken(request: any) {
  // const loginRes = await request.post(`${BASE_URL}/auth/login`, {
  //   data: {
  //     username: DEFAULT_USERNAME,
  //     password: DEFAULT_PASSWORD,
  //   },
  // });
  // expect(loginRes.ok()).toBeTruthy();
  // const loginBody = await loginRes.json();
  // return loginBody.data.token;
  return "eyJhbGciOiJIUzI1NiIsImtpZCI6Inp4aFRvNEtwcm1CZzBQTloiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3RpZWtxY2ZzY2Juamx6bWZhb255LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIxMmFhYWJkYS02OGI2LTQ4NjctYTExNC1hZTAxMWU2YzIzOWUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY1ODU1MjY0LCJpYXQiOjE3NjU4NTE2NjQsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NjU4NTE2NjR9XSwic2Vzc2lvbl9pZCI6IjZhYzk4NDY3LTU0MzMtNGY3ZC05MTIyLTdhYTgyMGU0N2U3YSIsImlzX2Fub255bW91cyI6ZmFsc2V9.PLa9YSTawakQ3GzrVzo-AAwHjhPwchyheqeCpvdSy48";
}

export { getAuthToken };
