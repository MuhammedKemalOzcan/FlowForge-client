import { AuthGuard } from "./components/AuthGuard";
import { EndpointsSection } from "./components/EndpointsSection";
import DeliveriesTable from "./components/DeliveriesTable";
import { ApiKeyBanner } from "./components/ApiKeyBanner";

export default function Home() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <section>
            <ApiKeyBanner />
            <div className="mt-4">
              <EndpointsSection />
            </div>
          </section>

          <section>
            <DeliveriesTable />
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
