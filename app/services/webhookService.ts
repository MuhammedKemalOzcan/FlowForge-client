import { apiClient, type ApiResult } from "../lib/apiClient";
import type { SendWebhookRequest } from "../types/webhook";

export const webhookService = {
  send: (req: SendWebhookRequest): Promise<ApiResult<string>> =>
    apiClient.post<string>("/WebhookDelivery", req),
};
