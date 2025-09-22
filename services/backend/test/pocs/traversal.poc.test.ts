import express from "express";
import request from "supertest";
import { Server } from "http";
import InvoiceService from "../../src/services/invoiceService";
import db from "../../src/db";
import { Invoice } from "../../src/types/invoice";

describe("Path Traversal PoC", () => {
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

    app.get("/invoices/:id/invoice", async (req, res) => {
      try {
        const invoiceId = req.params.id;
        const pdfName = req.query.pdfName as string | undefined;

        if (!pdfName) {
          return res.status(400).json({ error: "Missing parameter pdfName" });
        }
        const pdf = await InvoiceService.getReceipt(invoiceId, pdfName);
        res.setHeader("Content-Type", "application/pdf");
        res.send(pdf);
      } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
      }
    });

    server = app.listen(0);
  });

  afterAll(async () => {
    await db("invoices").del();
    await db("users").del();
    server.close();
    await db.destroy();
  });

  it("should read /etc/passwd through path traversal", async () => {
    const maliciousPdfName = "../../../../../../../../../../etc/passwd";
    const response = await request(app).get(
      `/invoices/1/invoice?pdfName=${encodeURIComponent(maliciousPdfName)}`,
    );

    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
