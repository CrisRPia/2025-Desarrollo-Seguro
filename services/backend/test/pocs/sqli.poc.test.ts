import express from 'express';
import request from 'supertest';
import { Server } from 'http';
import InvoiceService from '../../src/services/invoiceService';
import db from '../../src/db';
import { Invoice } from '../../src/types/invoice';

describe('SQL Injection PoC', () => {
  let app: express.Express;
  let server: Server;

  // Define users consistent with seed data structure
  const testUser = {
    id: "1",
    username: 'test',
    email: 'test@example.local',
    password: 'password',
    first_name: 'Test',
    last_name: 'User',
    activated: true,
  };

  const otherUser = {
    id: "2",
    username: 'prod',
    email: 'prod@example.local',
    password: 'password',
    first_name: 'Prod',
    last_name: 'User',
    activated: true,
  };

  beforeAll(async () => {
    // Setup: Insert our specific test data
    await db('users').insert([testUser, otherUser]);
    await db('invoices').insert([
      { id: "1", userId: testUser.id, amount: 101.00, dueDate: new Date('2025-01-01'), status: 'unpaid' },
      { id: "2", userId: testUser.id, amount: 102.00, dueDate: new Date('2025-01-01'), status: 'paid' },
      { id: "3", userId: testUser.id, amount: 103.00, dueDate: new Date('2025-01-01'), status: 'paid' },
      { id: "4", userId: otherUser.id, amount: 99.00, dueDate: new Date('2025-01-01'), status: 'unpaid' },
    ] satisfies Invoice[]);

    app = express();
    app.use(express.json());

    // Create a minimal, unsecured endpoint just for this test
    app.get('/invoices', async (req, res) => {
      try {
        const userId = testUser.id; // Hardcode the user for the test
        const { status, operator } = req.query;
        const invoices = await InvoiceService.list(userId, status as string, operator as string);
        res.json(invoices);
      } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
      }
    });

    server = app.listen(0); // Listen on a random free port
  });

  afterAll(async () => {
    // Teardown: Clean up the data we created
    await db('invoices').del();
    await db('users').del();
    server.close();
    await db.destroy();
  });

  it('should NOT retrieve all invoices via SQL injection', async () => {
    // The malicious payload
    const maliciousStatus = "' OR '1'='1";
    const operator = '=';

    const response = await request(app)
      .get(`/invoices?status=${encodeURIComponent(maliciousStatus)}&operator=${operator}`);

    expect(response.status).toBe(200);

    // Since we are injecting to get all users, this fails.
    expect(response.body.length).toBe(0);
  });
});


