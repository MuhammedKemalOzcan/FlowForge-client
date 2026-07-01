export type BackoffStrategy = "Fixed" | "Linear" | "Exponential";

export interface SendWebhookRequest {
  endpointId: string;
  eventType: string;
  payload: string;
  idempotencyKey: string;
}

export interface RetryPolicyDto {
  maxAttempts: number;
  initialDelaySeconds: number; // ← "00:00:01" → 1
  maxDelaySeconds: number;
  strategy: BackoffStrategy;
  timeoutSeconds: number;
}

export interface CreateWebhookEndpointRequest {
  endpointName: string;
  targetUrl: string;
  eventTypes: string[];
  maxAttempts: number;
  strategy: number;
  initialDelay: string;
  maxDelay: string;
  timeout: string;
}

export interface WebhookEndpointDto {
  id: string;
  name: string;
  targetUrl: string;
  eventTypes: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  retryPolicy: RetryPolicyDto;
}
