export interface ApiResponseHandler<T> {
  message: string;
  data: T;
  success: boolean;
  status: boolean;
}
