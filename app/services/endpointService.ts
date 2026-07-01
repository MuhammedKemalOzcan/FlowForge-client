import { apiClient, type ApiResult } from "../lib/apiClient";
import type {
  CreateWebhookEndpointRequest,
  WebhookEndpointDto,
} from "../types/webhook";

export const endpointService = {
  list: (): Promise<ApiResult<WebhookEndpointDto[]>> =>
    apiClient.get("/WebhookEndpoint"),

  create: (req: CreateWebhookEndpointRequest): Promise<ApiResult<string>> =>
    apiClient.post("/WebhookEndpoint", req),

  /** Sends DELETE /WebhookEndpoint/{endpointId}. Returns ok/error, no data. */
  remove: (endpointId: string): Promise<ApiResult<void>> =>
    apiClient.delete(`/WebhookEndpoint/${endpointId}`),
};
