import { apiClient, type ApiResult } from "../lib/apiClient";
import type { DemoSessionDto } from "../types/session";

export const bootstrapDemo = (): Promise<ApiResult<DemoSessionDto>> =>
  apiClient.post<DemoSessionDto>("/Demo", null, { skipAuth: true });
