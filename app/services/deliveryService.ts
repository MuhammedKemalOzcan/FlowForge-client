import { apiClient, type ApiResult } from "../lib/apiClient";
import type { DeliveryStatus, WebhookDeliveryDto } from "../types/delivery";
import type { PagedResultDto } from "../types/pagination";

export const deliveryService = {
  list: (
    page: number,
    pageSize: number,
    deliveryStatus?: DeliveryStatus,
  ): Promise<ApiResult<PagedResultDto<WebhookDeliveryDto>>> => {
    const base = `/WebhookDelivery/all?page=${page}&pageSize=${pageSize}`;
    const url = deliveryStatus !== undefined ? `${base}&Status=${deliveryStatus}` : base;
    return apiClient.get(url);
  },

  requeue: (deliveryId: string): Promise<ApiResult<void>> =>
    apiClient.post(`/WebhookDelivery/${deliveryId}/requeue`, null),
};
