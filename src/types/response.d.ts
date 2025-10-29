/**
 * @description 通用API响应结构
 */
export interface ApiResponse<T> {
  // 响应码
  code: number;
  // 响应数据
  data?: T;
  // 响应信息
  message: string;
}
