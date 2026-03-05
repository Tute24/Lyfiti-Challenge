'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema } from '@/schemas/create-task-schema';
import z from 'zod';
import { createTaskRequest } from '../api/create-task-request';
import { useState } from 'react';

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export function CreateTaskForm() {
  const [statusMessage, setStatusMessage] = useState<string>('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
  });

  async function onSubmit(data: CreateTaskFormData) {
    const createTaskResult = await createTaskRequest(data);
    if (!createTaskResult.success) {
      setStatusMessage(createTaskResult.message);
      return;
    }
    setStatusMessage(createTaskResult.message);
    reset();
  }

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-cyan-400 p-8">
        <h1 className="text-2xl font-semibold font-sans text-gray-900 mb-6 text-center">
          Create Task
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Task title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700 transition-colors"
              {...register('title')}
            />
            {errors.title && (
              <span className="text-xs text-red-500">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Task description
            </label>
            <input
              id="description"
              type="text"
              placeholder="Enter task description"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700 transition-colors"
              {...register('description')}
            />
            {errors.description && (
              <span className="text-xs text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full bg-cyan-700 hover:bg-cyan-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg py-2.5 transition-colors mt-1"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
          {statusMessage && (
            <span className="text-sm text-center text-gray-700 mt-2">
              {statusMessage}
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
