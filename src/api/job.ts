import request from '@/utils/request';
import type { ApiResponse } from '@/types/response';
import type { JobResponseType, JobParamsType } from '@/types/job';

// 获取任务
export const getJobsAPI = (): Promise<ApiResponse<JobResponseType[]>> => {
  return request.get('/jobs');
};

// 新建任务
export const createJobAPI = (
  data: JobParamsType
): Promise<ApiResponse<JobResponseType>> => {
  return request.post('/jobs', data);
};

//删除任务
export const deleteJobAPI = (
  id: number
): Promise<ApiResponse<JobResponseType>> => {
  return request.delete(`/jobs/${id}`);
};

// 停止任务
export const stopJobAPI = (
  id: number
): Promise<ApiResponse<JobResponseType>> => {
  return request.post(`/jobs/${id}/stop`);
};

// 重启任务
export const restartJobAPI = (
  id: number
): Promise<ApiResponse<JobResponseType>> => {
  return request.post(`/jobs/${id}/start`);
};

// 更新任务
export const updateJobAPI = (
  id: number,
  data: JobParamsType
): Promise<ApiResponse<JobResponseType>> => {
  return request.put(`/jobs/${id}`, data);
};
