import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { CallHook, ScreenHeader } from "@/components/Chrome";
import { Button } from "@/components/kit";
import { useApp } from "@/lib/store";

const searchSchema = z.object({ id: z.string().catch("") });

export const Route = createFileRoute("/_app/confirmation")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "SIH&S — Confirmation" }] }),
  component: Confirmation,
});

function Confirmation() {
  const { id } = Route.useSearch();
  const { bookings } = useApp();
  const navigate = useNavigate();
  const booking = bookings.find((item) => item.id === id) ?? bookings[0];

  return (
    <div>
      <ScreenHeader title="Request received" />
      <div className="px-4 pb-8">
        <h2 className="text-2xl font-semibold">Request received—pending SIH&S confirmation.</h2>
        {booking ? (
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Request number</dt>
              <dd className="font-semibold">{booking.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Service</dt>
              <dd className="font-semibold">{booking.serviceTitle}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-sm">Your request was recorded.</p>
        )}
        <h3 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wide">What happens next</h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>SIH&S reviews your request.</li>
          <li>SIH&S contacts you at your callback number.</li>
          <li>If confirmed, you will see the quote and deposit step in the app.</li>
        </ol>
        {booking?.syncStatus === "saved-locally" && (
          <p className="mt-4 rounded-md border border-border bg-card p-3 text-sm">Saved locally. This request sends when the connection returns.</p>
        )}
        <div className="mt-6 space-y-3">
          <CallHook />
          {booking && (
            <Button type="button" full onClick={() => navigate({ to: "/requests/$id", params: { id: booking.id } })}>
              View Request
            </Button>
          )}
          <Button type="button" variant="outline" full onClick={() => navigate({ to: "/home" })}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
