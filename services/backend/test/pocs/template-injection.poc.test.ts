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
    // Si el servicio evalúa el valor, la respuesta tendrá el resultado de
    // éste cáclulo.
    const value = "7*7*7*7*7*7";
    // Utilizamos el eval de js para calcular exactamente el valor objetivo.
    const computed = eval(value);
    const maliciousFirstName = `<%= ${value} %>`;
    const response = await request(app).post("/users").send({
      username: "testuser",
      password: "password",
      email: "test@test.com",
      first_name: maliciousFirstName,
      last_name: "User",
    });

    const sendMailMock = (nodemailer.createTransport() as any).sendMail;
    // Se utilizó el mock
    expect(sendMailMock).toHaveBeenCalled();

    // El html no contiene el valor computado
    const emailHtml = sendMailMock.mock.calls[0][0].html;
    expect(emailHtml).not.toContain(computed.toString());

   // El html contiene el valor sin computar
    expect(emailHtml).toContain(value);
  });
});
