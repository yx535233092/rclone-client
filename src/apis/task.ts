import request from '@/utils/request';
import type { TaskType, ReturnData } from '@/types/task';
// import type { ReturnData } from '@/types/common';

const createTaskAPI = (data: TaskType): Promise<ReturnData> => {
  return request.post('/task', data);
};

const getTasksAPI = (): Promise<ReturnData> => {
  return request.get('/task');
};

const startTaskAPI = (id: number): Promise<ReturnData> => {
  return request.post(`/task/start/${id}`);
};

const stopTaskAPI = (id: number): Promise<ReturnData> => {
  return request.post(`/task/stop/${id}`);
};

const deleteTaskAPI = (id: number): Promise<ReturnData> => {
  return request.delete(`/task/${id}`);
};

const updateTaskAPI = (
  id: number,
  data: Partial<TaskType>
): Promise<ReturnData> => {
  return request.put(`/task/${id}`, data);
};

export {
  createTaskAPI,
  getTasksAPI,
  startTaskAPI,
  stopTaskAPI,
  deleteTaskAPI,
  updateTaskAPI
};
