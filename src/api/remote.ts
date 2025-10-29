import request from '@/utils/request';
import type { ApiResponse } from '@/types/response';
import type { RemoteResponseType, RemoteParamsType } from '@/types/remote';

// 新增配置
export const createRemoteAPI = (
  data: RemoteParamsType
): Promise<ApiResponse<RemoteResponseType>> => {
  return request.post('/remotes', data);
};

// 获取配置
export const getRemotesAPI = (params: {
  type: string;
}): Promise<ApiResponse<RemoteResponseType[]>> => {
  return request('/remotes', { params });
};

// 编辑设备
export const updateRemoteAPI = (
  id: number,
  data: RemoteParamsType
): Promise<ApiResponse<RemoteResponseType>> => {
  return request.put(`/remotes/${id}`, data);
};

// 删除设备
export const deleteRemoteAPI = (
  id: number
): Promise<ApiResponse<RemoteResponseType>> => {
  return request.delete(`/remotes/${id}`);
};
