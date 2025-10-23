import request from '@/utils/request';
import type { DeviceType, ReturnData } from '@/types/device';

// 创建设备
const createDeviceAPI = (
  data: DeviceType,
  deviceType: string
): Promise<ReturnData> => {
  return request.post(`/device?device_type=${deviceType}`, data);
};

// 获取设备列表
const getDevicesAPI = (query: { device_type: string }): Promise<ReturnData> => {
  return request.get('/device', { params: query });
};

// 删除设备
const deleteDeviceAPI = (id: number): Promise<ReturnData> => {
  return request.delete(`/device/${id}`);
};

// 编辑设备
const updateDeviceAPI = (data: DeviceType): Promise<ReturnData> => {
  console.log(data);

  return request.put(`/device/${data.id}`, data);
};

export { createDeviceAPI, getDevicesAPI, deleteDeviceAPI, updateDeviceAPI };
