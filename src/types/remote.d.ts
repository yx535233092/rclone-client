// 配置类型常量的类型声明
type RemoteType = 'target' | 'source';

// 请求参数
export interface RemoteParamsType {
  name: string;
  type: RemoteType;
  remote_type: string;
  protocol: string;
  ak: string;
  sk: string;
  endpoint: string;
}

// 配置类型
export interface RemoteResponseType {
  id: number;
  name: string;
  type: RemoteType;
  config_json: string;
}

// 业务配置类型
export interface RemoteModelType {
  key: number;
  id: number;
  name: string;
  type: string;
  remote_type: string;
  protocol: string;
  ak: string;
  sk: string;
  endpoint: string;
  config_json: string;
}
