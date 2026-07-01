import { WebhookEndpointDto } from "../types/webhook";

export const endpointCards: WebhookEndpointDto[] = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "Order Events",
    targetUrl: "https://hooks.example.com/orders",
    eventTypes: ["order.created", "order.updated", "order.cancelled"],
    isActive: true,
    createdAt: "2026-05-01T10:00:00Z",
    updatedAt: "2026-05-20T14:30:00Z",
    retryPolicy: {
      maxAttempts: 5,
      initialDelaySeconds: 30,
      maxDelaySeconds: 300,
      strategy: "Exponential" as const,
      timeoutSeconds: 30,
    },
  },
  {
    id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    name: "User Activity",
    targetUrl: "https://hooks.example.com/users",
    eventTypes: ["user.registered", "user.login"],
    isActive: false,
    createdAt: "2026-04-15T08:00:00Z",
    updatedAt: "2026-05-10T11:00:00Z",
    retryPolicy: {
      maxAttempts: 3,
      initialDelaySeconds: 60,
      maxDelaySeconds: 180,
      strategy: "Linear" as const,
      timeoutSeconds: 30,
    },
  },
];
