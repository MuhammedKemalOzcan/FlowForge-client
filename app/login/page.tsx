import TryDemoButton from "../components/TryDemoButton";

const DEMO_FEATURES = [
  { label: "Endpoint registration", detail: "Create & manage webhook endpoints" },
  { label: "Live delivery tracking", detail: "See successful and failing deliveries" },
  { label: "Automatic retries", detail: "Configurable retry policies" },
  { label: "Dead-letter handling", detail: "Retry from dead-letter queue" },
];

function FeatureItem({ label, detail }: { label: string; detail: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <span className="text-sm text-gray-400">
        <span className="font-medium text-gray-200">{label}</span>
        {" — "}
        {detail}
      </span>
    </li>
  );
}

function FlowDiagram() {
  const steps = ["Event", "Queue", "Deliver", "Retry"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300">
            {step}
          </div>
          {i < steps.length - 1 && (
            <svg className="h-3.5 w-3.5 shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
        {/* Left — branding & info */}
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">FlowForge</span>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
              Webhook delivery,{" "}
              <span className="text-indigo-400">battle-tested.</span>
            </h1>
            <p className="text-base leading-relaxed text-gray-400">
              A production-grade webhook engine with automatic retries, dead-letter
              queues, and full delivery history. Explore it live in seconds.
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-3">
            {DEMO_FEATURES.map((f) => (
              <FeatureItem key={f.label} label={f.label} detail={f.detail} />
            ))}
          </ul>

          {/* Flow diagram hint */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-gray-600">Delivery pipeline</span>
            <FlowDiagram />
          </div>
        </div>

        {/* Right — demo card */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm shadow-2xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-semibold text-white">Demo Console</h2>
                <p className="text-sm text-gray-400">
                  No account needed. We&apos;ll provision a temporary tenant with a
                  pre-configured API key instantly.
                </p>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5 rounded-lg bg-white/5 px-3.5 py-3 text-sm text-gray-400 border border-white/5">
                  <svg className="h-4 w-4 shrink-0 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
                  </svg>
                  <span>Instant API key provisioning</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg bg-white/5 px-3.5 py-3 text-sm text-gray-400 border border-white/5">
                  <svg className="h-4 w-4 shrink-0 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>Session lasts for your demo</span>
                </div>
              </div>

              <TryDemoButton />

              <p className="text-center text-xs text-gray-600">
                Isolated sandbox · No data retained after session
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
