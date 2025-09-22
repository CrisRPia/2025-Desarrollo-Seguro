import request from "supertest";
import express from "express";
import db from "../../src/db";
import { Invoice } from "../../src/types/invoice";
import invoices from "../../src/controllers/invoiceController";

describe("Path Traversal PoC", () => {
  let app: express.Express;
  let testUserId: string;
  let testInvoiceId: string;

  const testUser = {
    username: "test_traversal",
    email: "test_traversal@example.local",
    password: "password",
    first_name: "Test",
    last_name: "User",
    activated: true,
  };

  beforeAll(async () => {
    // Clean up any existing test data
    await db("users").where("email", testUser.email).del();

    // Insert test user and get the generated ID
    const [insertedUser] = await db("users").insert(testUser).returning("*");
    testUserId = insertedUser.id;

    // Insert test invoice
    const testInvoice = {
      userId: testUserId,
      amount: 101.0,
      dueDate: new Date("2025-01-01"),
      status: "unpaid",
    } satisfies Omit<Invoice, "id">;

    const [insertedInvoice] = await db("invoices")
      .insert(testInvoice)
      .returning("*");
    testInvoiceId = insertedInvoice.id;

    // Create minimal app with just the route and error handler
    app = express();
    app.use(express.json());
    app.get("/invoices/:id/invoice", invoices.getInvoicePDF);

    // Simple error handler
    app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
      },
    );
  });

  afterAll(async () => {
    // Clean up test data
    await db("invoices").where("id", testInvoiceId).del();
    await db("users").where("id", testUserId).del();
    await db.destroy();
  });

  it("should not read /etc/passwd through path traversal", async () => {
    const maliciousPdfName = "../../../../../../../../../../etc/passwd";
    const response = await request(app).get(
      `/invoices/${testInvoiceId}/invoice?pdfName=${encodeURIComponent(maliciousPdfName)}`,
    );

    // Should return 400+ status code for path traversal attempt
    expect(response.status).toBeGreaterThanOrEqual(400);

    // Should return an error message about path traversal
    expect(response.body.error).toContain("traversal");
  });
});
