import request from "supertest";
import { Server } from "http";
import db from "../../src/db";
import app from "../../src/index"; // Import the actual app with middleware

describe("Missing Authorization PoC", () => {
  let server: Server;
  let testUserId: number;
  const testUser = {
    username: "testuser_auth_poc",
    email: "test_auth_poc@test.com",
    password: "password",
    first_name: "Initial",
    last_name: "User",
    activated: true,
  };

  beforeAll(async () => {
    // Clean up any existing test data first
    await db("users").where("email", testUser.email).del();

    // Insert test user and get the generated ID
    const [insertedUser] = await db("users").insert(testUser).returning("*");
    testUserId = insertedUser.id;
  });

  afterAll(async () => {
    // Clean up test data
    await db("users").where("id", testUserId).del();
    await db.destroy();
  });

  it("should FAIL to update a user via PUT /users/:id without authentication", async () => {
    const response = await request(app)
      .put(`/users/${testUserId}`)
      .send({ first_name: "MaliciouslyUpdated" });

    // This test asserts the SECURE behavior.
    // A secure system should prevent access and return a 401 or 403 status.
    expect(response.status).toBe(401);

    // Optional: You could also check that the name was NOT updated in a secure system.
    const dbUser = await db("users").where({ id: testUserId }).first();
    expect(dbUser.first_name).toBe("Initial");
  });
});
