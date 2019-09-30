export interface IApiResponseError {
  success?: boolean;
  message?: string;
  code?: number;
  errorObj?: string | object;
  errorsArray?: any[];
  error?: object;
}
