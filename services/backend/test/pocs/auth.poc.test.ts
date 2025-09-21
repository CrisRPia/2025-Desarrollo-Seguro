import express from "express";
import request from "supertest";
import { Server } from "http";
import db from "../../src/db";
import userRoutes from "../../src/routes/user.routes"; // Import the actual user routes

describe("Missing Authorization PoC", () => {
  let app: express.Express;
  let server: Server;
  const testUser = {
    id: 1,
    username: "testuser",
    email: "test@test.com",
    password: "password",
    first_name: "Initial",
    last_name: "User",
    activated: true,
  };

  beforeAll(async () => {
    await db("users").insert(testUser);

    app = express();
    app.use(express.json());
    app.use("/users", userRoutes);

    server = app.listen(0);
  });

  afterAll(async () => {
    await db("users").del();
    server.close();
    await db.destroy();
  });

  it("should FAIL to update a user via PUT /users/:id without authentication", async () => {
    const response = await request(app)
      .put(`/users/${testUser.id}`)
      .send({ first_name: "MaliciouslyUpdated" });

    // This test asserts the SECURE behavior.
    // A secure system should prevent access and return a 401 or 403 status.
    expect(response.status).toBe(401);

    // The test will FAIL because the current vulnerable code allows the update
    // and returns a 200 status, proving that authorization is missing.

    // Optional: You could also check that the name was NOT updated in a secure system.
    const dbUser = await db("users").where({ id: testUser.id }).first();
    expect(dbUser.first_name).toBe("Initial");
  });
});
