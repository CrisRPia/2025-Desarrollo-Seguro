import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import net from 'net';
import { setupSwagger } from './swagger'
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import clinicalHistoryRoutes from './routes/clinicalhistory.routes';
import invoiceRoutes from './routes/invoices.routes';
import authMiddleware from './middleware/auth.middleware';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();

// FIXME: cors???
// Permitir cualquier origen
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.use('/auth', authRoutes);

// Protect everything below
app.use(authMiddleware);
app.use('/users', userRoutes);
app.use('/clinical-history', clinicalHistoryRoutes);
app.use('/invoices', invoiceRoutes);

// Global error handler
app.use(errorHandler);

const PORT = parseInt(process.env.PORT) || 3000;

// Function to check if port is available
const isPortFree = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
        const testServer = net.createServer();
        testServer.listen(port, () => {
            testServer.close(() => resolve(true));
        });
        testServer.on('error', () => resolve(false));
    });
};

// Only start server if port is free
isPortFree(PORT).then(isFree => {
    if (isFree) {
        app.listen(PORT, () => {
            // this is kinda dumb given docker and proxies
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`)
        });
    } else {
        console.log(`Port ${PORT} is in use, skipping server start`);
    }
});

export default app;
