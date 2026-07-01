# CLAUDE.md — FlowForge Demo Frontend Guidelines

## Project Context

FlowForge is a production-inspired webhook delivery engine.

The demo frontend must show the backend capabilities without becoming a full dashboard.

Core backend features to demonstrate:

- Demo tenant / user / API key bootstrap
- API key usage through `X-Api-Key` header
- Webhook endpoint creation
- Successful webhook delivery
- Failing webhook delivery
- Retry attempts
- DeadLettered deliveries
- Retry from DeadLetter
- Delivery attempt history

This frontend is a **Demo Console**, not a production dashboard.

Keep the UI minimal, focused, and easy to understand.

---

## Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zustand for client state
- Fetch API or a small typed API client
- No heavy UI framework unless already installed
- The types are defined in the `types` file; do not change them. If needed, ask and suggest a method. 

Do not add unnecessary dependencies.

---

## Main Goal

Build a single-page demo experience:

## Rules

- When designing components, separate responsibilities as much as possible; design small components with different responsibilities.
- When designing something, I want you to explain why it's designed that way and why you chose that particular method.
- In the code you write, include comments describing the functions.
- Don't try to guess the response types. If you don't know, ask the user what the response type is and proceed accordingly.
- You can only delete the console.log() files to modify the code the user has corrected.