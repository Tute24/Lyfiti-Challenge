import { createTaskController } from '@/controllers/tasks/create-task';
import { getTasksController } from '@/controllers/tasks/get-tasks';
import { asyncHandler } from '@/utils/async-handler';
import express, { type Router } from 'express';

export const tasksRouter: Router = express.Router();

tasksRouter.get('/', asyncHandler(getTasksController));
tasksRouter.post('/', asyncHandler(createTaskController));
