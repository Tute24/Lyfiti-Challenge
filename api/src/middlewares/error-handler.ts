import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      message: error.message,
    });
  }
  console.log('Error: ', error); //para debug
  return res.status(500).json({
    message: 'Erro no servidor.',
  });
}
