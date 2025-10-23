interface DeviceType {
  id?: number;
  key?: number;
  name: string;
  type: string;
  protocol: string;
  ak: string;
  sk: string;
  endpoint: string;
}

interface ReturnData {
  code: number;
  message: string;
  data?: DeviceType[];
}

export { DeviceType, ReturnData };
