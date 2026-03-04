import { apiClient } from '@/utils/api-client';
import axios from 'axios';
import { CreateTaskDto } from '../dtos/create-task-dto';

type CreateTaskResult = { success: boolean; message: string };

export async function createTaskRequest(
  data: CreateTaskDto,
): Promise<CreateTaskResult> {
  try {
    const response = await apiClient({
      httpMethod: 'post',
      route: '/tasks',
      data: data,
    });

    const { message } = response.data as { message: string };
    return { success: true, message };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      return { success: false, message: err.response.data.message };
    }
    return {
      success: false,
      message: 'Something went wrong, please try again.',
    };
  }
}
