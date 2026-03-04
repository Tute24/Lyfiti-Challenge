import { createTaskController } from '@/controllers/tasks/create-task';
import { asyncHandler } from '@/utils/async-handler';
import express, { type Router } from 'express';

export const tasksRouter: Router = express.Router();

tasksRouter.post('/', asyncHandler(createTaskController));
