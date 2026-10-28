import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import emptyOngoing from "@/img/empty-ongoing.jpg";
import emptyCompleted from "@/img/empty-completed.jpg";
import emptyCanceled from "@/img/empty-canceled.jpg";
import { Button } from "@/components/kit";
import { CUSTOMER_CONFIG, customerStatusLabel } from "@/lib/customer-config";
import { DEPOSIT_EARNED, REFUND_LINE } from "@/lib/content";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/bookings")({
  head: () => ({ meta: [{ title: "SIH&S — Requests" }] }),
  component: Bookings,
});

const TABS = ["active", "completed", "canceled"] as const;

const EMPTY_ART = {
  active: emptyOngoing,
  completed: emptyCompleted,
  canceled: emptyCanceled,
} as const;

function Bookings() {
  const { bookings, cancelBooking } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]>("active");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const navigate = useNavigate();
  const list = bookings.filter((b) => {
    if (tab === "completed") return b.status === "completed";
    if (tab === "canceled") return b.status === "canceled";
    return b.status !== "completed" && b.status !== "canceled";
  });

  return (
    <div className="px-4 pb-6 pt-[max(1rem,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-semibold">Requests</h1>
      <div className="mt-4 grid grid-cols-3 gap-2" role="tablist" aria-label="Request status">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={`min-h-11 rounded-md text-sm font-semibold capitalize ${
              tab === item ? "bg-[#5fbb3f] text-[#001e16]" : "border border-border bg-card text-foreground"
            }`}
          >
            {item === "canceled" ? "Canceled" : item === "active" ? "Active" : "Completed"}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {list.length === 0 && (
          <div className="rounded-md border border-dashed border-border bg-card p-6 text-center">
            <img
              src={EMPTY_ART[tab]}
              alt=""
              className="mx-auto h-36 w-36 object-contain"
            />
            <p className="mt-3 text-sm font-semibold text-[#f4f7f5]">No {tab} requests</p>
            <button
              type="button"
              onClick={() => navigate({ to: "/home" })}
              className="mt-3 min-h-11 text-sm font-semibold text-accent-text underline"
            >
              Request a service
            </button>
          </div>
        )}
        {list.map((booking) => {
          const closed = booking.status === "completed" || booking.status === "canceled";
          const updated = booking.statusHistory?.at(-1)?.at;
          return (
            <article key={booking.id} className="rounded-[16px] border border-white/15 bg-[#06281f] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-[#c5d4cc]">{booking.id}</p>
                  <p className="mt-1 inline-flex rounded-md border border-white/20 px-2 py-1 text-xs font-semibold">{booking.serviceTitle}</p>
                </div>
                <span className="shrink-0 rounded-md bg-[#5fbb3f] px-2 py-1 text-xs font-semibold text-[#001e16]">
                  {customerStatusLabel(booking.status, booking.customerLabel)}
                </span>
              </div>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#c5d4cc]">Property</dt>
                  <dd className="text-right">{booking.propertyAddress || booking.organizationLabel || "Not entered"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#c5d4cc]">Service location</dt>
                  <dd className="text-right">{booking.serviceLocation || booking.pickupLocation || "Not entered"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#c5d4cc]">Preferred or scheduled time</dt>
                  <dd className="text-right">{booking.preferredTiming || booking.when}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#c5d4cc]">Last update</dt>
                  <dd className="text-right">{updated ? new Date(updated).toLocaleString() : booking.when}</dd>
                </div>
              </dl>
              {booking.status === "completed" && (
                <p className="mt-3 text-sm text-[#f4f7f5]">{booking.paymentSummary || "Payment recorded on the job."} Before and after photos are on the record.</p>
              )}
              {booking.status === "canceled" && (
                <div className="mt-3 space-y-1 text-sm">
                  <p>Reason: {booking.cancelReason || "Not recorded"}</p>
                  <p>{booking.paymentSummary}</p>
                  <p className="text-xs text-[#c5d4cc]">{REFUND_LINE}</p>
                  {booking.depositDispatched && <p className="text-xs text-[#c5d4cc]">{DEPOSIT_EARNED}</p>}
                </div>
              )}
              {booking.syncStatus && booking.syncStatus !== "received" && (
                <p className="mt-2 text-sm">Request received—media upload pending · {booking.syncStatus === "saved-locally" ? "Saved locally" : "Uploading"}</p>
              )}
              {!closed && <p className="mt-2 text-xs text-[#c5d4cc]">Request is not approval. Accepted is not scheduled.</p>}
              <div className="mt-3 flex flex-wrap items-center gap-x-4">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/requests/$id", params: { id: booking.id } })}
                  className="min-h-11 text-sm font-semibold text-[#8fd86f] underline"
                >
                  View full record
                </button>
                {(booking.status === "pending" || booking.status === "ongoing") && (
                  <button type="button" onClick={() => setCancelId(booking.id)} className="min-h-11 text-sm font-semibold text-danger underline">
                    Request cancellation
                  </button>
                )}
                {booking.status === "canceled" && (
                  <button type="button" onClick={() => navigate({ to: "/home" })} className="min-h-11 text-sm font-semibold text-[#8fd86f] underline">
                    Request a service
                  </button>
                )}
              </div>
              {(booking.status === "pending" || booking.status === "ongoing") && (
                <p className="mt-1 text-xs text-[#c5d4cc]">{CUSTOMER_CONFIG.cancellationMessage}</p>
              )}
            </article>
          );
        })}
      </div>
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
          <div className="w-full max-w-[480px] rounded-t-[16px] bg-[#06281f] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <h2 id="cancel-title" className="text-xl font-semibold">Request Cancellation</h2>
            <p className="mt-2 text-sm text-muted-foreground">This asks SIH&S to review the cancellation. It does not cancel the request by itself.</p>
            <Button type="button" full className="mt-4" onClick={() => { cancelBooking(cancelId); setCancelId(null); }}>
              Request Cancellation
            </Button>
            <button type="button" className="mt-2 min-h-11 w-full font-semibold" onClick={() => setCancelId(null)}>Keep request</button>
          </div>
        </div>
      )}
    </div>
  );
}
