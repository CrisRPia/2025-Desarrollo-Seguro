import express from "express";
import request from "supertest";
import { Server } from "http";
import db from "../../src/db";
import userRoutes from "../../src/routes/user.routes";
import nodemailer from "nodemailer";

jest.mock("nodemailer");
const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

describe("Template Injection PoC", () => {
  let app: express.Express;
  let server: Server;

  beforeAll(async () => {
    mockedNodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({ success: true }),
    } as any);

    app = express();
    app.use(express.json());
    app.use("/users", userRoutes);

    server = app.listen(0);
  });

  afterAll(async () => {
    server.close();
    await db.destroy();
  });

  it("should NOT execute injected code in the email template", async () => {
    const value = "7*7*7*7*7*7";
    const computed = eval(value);
    const maliciousFirstName = `<%= ${value} %>`;
    const response = await request(app).post("/users").send({
      username: "testuser",
      password: "password",
      email: "test@test.com",
      first_name: maliciousFirstName,
      last_name: "User",
    });

    // This test asserts the SECURE behavior.
    // A secure system should not execute the injected code.
    const sendMailMock = (nodemailer.createTransport() as any).sendMail;
    expect(sendMailMock).toHaveBeenCalled();
    const emailHtml = sendMailMock.mock.calls[0][0].html;
    expect(emailHtml).not.toContain(computed.toString());
    expect(emailHtml).toContain(value);
  });
});
