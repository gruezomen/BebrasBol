/**
 * Configuración base de la aplicación Express
 * Inicialización minimalista de middleware y rutas
 */

import express, { type Application, type NextFunction, type Request, type Response } from 'express';

interface ErrorNegocio extends Error {
  status?: number;
}

const app: Application = express();

const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    status: 404,
  });
};

const errorHandler = (err: ErrorNegocio, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error:', err);
  const status = err.status ?? 500;
  const message = err.message ?? 'Error interno del servidor';

  res.status(status).json({
    error: message,
    status,
  });
};

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas (placeholder)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'servicio-usuario' });
});

// Manejo de rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware de error básico
app.use(errorHandler);

export default app;
