import { expect } from "@playwright/test";
import { API_BASE_URL } from "../../config/env.config";

const BASE_URL = `${API_BASE_URL}/api/v1`;
const DEFAULT_USERNAME = "pro@gmail.com";
const DEFAULT_PASSWORD = "Password!@#$1";

async function getAuthData(request: any, username: string = DEFAULT_USERNAME, password: string = DEFAULT_PASSWORD) {
  const loginRes = await request.post(`${BASE_URL}/auth/login`, {
    data: {
      username,
      password,
    },
  });
  expect(loginRes.ok()).toBeTruthy();
  const loginBody = await loginRes.json();
  return loginBody.data;
  // return {
  //   role: "basic",
  //   token: "eyJhbGciOiJIUzI1NiIsImtpZCI6Inp4aFRvNEtwcm1CZzBQTloiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3RpZWtxY2ZzY2Juamx6bWZhb255LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJiOWIzMWJkYS05NGFkLTQxNGQtYWIxMC0zODAzY2UxNDhlNjYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY1OTU1NTQzLCJpYXQiOjE3NjU5NTE5NDMsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc2NTk1MTk0M31dLCJzZXNzaW9uX2lkIjoiMGI0NTJmZjUtNTE3Mi00ZjUwLTk1MWUtNTZkMjViMDFmZGY5IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.gWws8JsHDJmtBa_AHq_vBbIfp8w-jF12I5rGmyuXUQs"
  // }
}

export { getAuthData };
