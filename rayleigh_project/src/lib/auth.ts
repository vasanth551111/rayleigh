import { cookies } from "next/headers";

// SIMULATION MODE: Returning a mock session for development
export async function getSession() {
  return {
    userId: "mock-user-id",
    email: "test@example.com",
    role: "STUDENT",
    name: "Test User"
  };
}

export async function signToken(payload: any) {
  return "mock-token";
}

export async function verifyToken(token: string) {
  return {
    userId: "mock-user-id",
    email: "test@example.com",
    role: "STUDENT",
    name: "Test User"
  };
}
