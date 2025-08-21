/**
 * @template T
 */
export interface ApiResult<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
}
