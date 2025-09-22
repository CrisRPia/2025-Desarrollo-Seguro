import express from "express";
import request from "supertest";
import { Server } from "http";
import InvoiceService from "../../src/services/invoiceService";
import db from "../../src/db";
import { Invoice } from "../../src/types/invoice";
import invoiceRoutes from "../../src/routes/invoices.routes";
import errorHandler from "../../src/middleware/errorHandler";

describe("SSRF PoC", () => {
  let app: express.Express;
  let server: Server;
  const testUser = {
    id: "1",
    username: "test",
    email: "test@example.local",
    password: "password",
    first_name: "Test",
    last_name: "User",
    activated: true,
  };

  beforeAll(async () => {
    await db("users").insert(testUser);
    await db("invoices").insert([
      {
        id: "1",
        userId: testUser.id,
        amount: 101.0,
        dueDate: new Date("2025-01-01"),
        status: "unpaid",
      },
    ] satisfies Invoice[]);

    app = express();
    app.use(express.json());
    // Mock the user on the request
    app.use((req, res, next) => {
      (req as any).user = { id: testUser.id };
      next();
    });
    app.use("/invoices", invoiceRoutes);
    app.use(errorHandler);

    server = app.listen(0);
  });

  afterAll(async () => {
    await db("invoices").del();
    await db("users").del();
    server.close();
    await db.destroy();
  });

  it("should NOT allow payment through an unauthorized payment provider", async () => {
    const response = await request(app).post("/invoices/1/pay").send({
      paymentBrand: "master", // instead of 'visa'
      ccNumber: "1234567890123456",
      ccv: "123",
      expirationDate: "12/25",
    });

    // This test asserts the SECURE behavior.
    // A secure system should not even attempt the request to an untrusted paymentBrand.
    // It should fail before making the external call.
    expect(response.status).toBe(500);
    expect(response.body.message).not.toContain(
      "Request failed with status code 400",
    );
  });
});
