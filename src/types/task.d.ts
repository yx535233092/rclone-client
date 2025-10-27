// 创建前的任务类型
interface TaskType {
  name: string;
  source_device_id: number;
  source_bucket_name: string;
  source_url: string;
  target_device_id: number;
  target_bucket_name: string;
  target_url: string;
  concurrent: number;
  limit_speed?: number;
  increment_circle?: number;
}

// 创建后的任务类型
interface TaskType {
  id?: number;
  key?: string;
  status?: string;
  transferredSize: string;
  totalSize?: string;
  downloadSpeed?: string;
  remainingTime?: string;
  elapsedTime?: string;
  percent?: string;
}

interface ReturnData {
  code: number;
  message: string;
  data?: unknown;
}

export type { TaskType, ReturnData };
