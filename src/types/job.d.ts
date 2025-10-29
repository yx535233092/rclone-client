export interface JobResponseType {
  id: number;
  name: string;
  status: string;
  source_remote: string;
  target_remote: string;
  rclone_options: string;
  pid: number | null;
  start_time: string | null;
  end_time: string | null;
  total_size_bytes: number | null;
}

export interface JobParamsType {
  name: string;
  source_remote_id: string;
  target_remote_id: string;
  source_bucket_name: string;
  source_url: string;
  target_bucket_name: string;
  target_url: string;
  concurrent: number;
  limit_speed: number;
}

export interface JobModelType extends JobResponseType {
  key: number;
  rcloneData: RcloneData | null;
}

interface RcloneData {
  time: string;
  level: string;
  msg: string;
  stats: RcloneStats;
  source: string;
}

interface RcloneStats {
  bytes: number;
  checks: number;
  deletedDirs: number;
  deletes: number;
  elapsedTime: number;
  errors: number;
  eta: number | null;
  fatalError: boolean;
  lastError: string;
  listed: number;
  renames: number;
  retryError: boolean;
  serverSideCopies: number;
  serverSideCopyBytes: number;
  serverSideMoveBytes: number;
  serverSideMoves: number;
  speed: number;
  totalBytes: number;
  totalChecks: number;
  totalTransfers: number;
  transferTime: number;
  transfers: number;
}
