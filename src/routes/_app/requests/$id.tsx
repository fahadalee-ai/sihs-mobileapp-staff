import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Art } from "@/components/Art";
import { CallHook, ScreenHeader } from "@/components/Chrome";
import { Button } from "@/components/kit";
import { RESTRICTED_MEDIA_SLUGS, customerStatusLabel } from "@/lib/customer-config";
import { DEPOSIT_EARNED, REFUND_LINE } from "@/lib/content";
import { useApp } from "@/lib/store";
import towingPhoto from "@/img/photo-towing.jpg";
import lockoutPhoto from "@/img/photo-lockout.jpg";
import jumpPhoto from "@/img/photo-jump.jpg";
import fuelPhoto from "@/img/photo-fuel.jpg";
import afterTow from "@/img/bg-tow.jpg";
import afterRoad from "@/img/bg-onboard-tow.jpg";

export const Route = createFileRoute("/_app/requests/$id")({
  head: () => ({ meta: [{ title: "SIH&S — Request" }] }),
  component: RequestDetail,
});

const JOB_PHOTOS: Record<string, [string, string]> = {
  towing: [towingPhoto, afterTow],
  lockouts: [lockoutPhoto, afterRoad],
  "jump-starts": [jumpPhoto, afterRoad],
  "fuel-delivery": [fuelPhoto, afterTow],
};

function formatStamp(iso?: string) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return {
    date: date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
  };
}

const TIMELINE = ["Received", "Reviewed", "Confirmed", "Scheduled", "Assigned", "In progress", "Completed"] as const;

function canonStep(label: string) {
  const value = label.toLowerCase();
  if (value.includes("completed")) return "Completed";
  if (value.includes("progress")) return "In progress";
  if (value.includes("assigned")) return "Assigned";
  if (value.includes("scheduled")) return "Scheduled";
  if (value.includes("confirmed") || value.includes("deposit")) return "Confirmed";
  if (value.includes("reviewed")) return "Reviewed";
  if (value.includes("received")) return "Received";
  return null;
}

function visibleSteps(history: { at: string; label: string }[]) {
  const found = new Map<string, string>();
  for (const event of history) {
    const step = canonStep(event.label);
    if (step && !found.has(step)) found.set(step, event.at);
  }
  return TIMELINE.filter((step) => found.has(step)).map((label) => ({ label, at: found.get(label) ?? "" }));
}

function RequestDetail() {
  const { id } = Route.useParams();
  const { bookings, cancelBooking, recordDeposit, acceptDelivery, reportDeliveryIssue, acknowledgeShared, addInformation, requestFollowUp, retrySync } = useApp();
  const navigate = useNavigate();
  const booking = bookings.find((item) => item.id === id);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [issue, setIssue] = useState("");
  const [info, setInfo] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [payOpen, setPayOpen] = useState<"deposit" | "balance" | null>(null);
  const [payFailed, setPayFailed] = useState(false);
  const [followUpId, setFollowUpId] = useState("");

  if (!booking) {
    return (
      <div>
        <ScreenHeader title="Request" backTo="/bookings" />
        <p className="px-4 text-sm">You don't have access to this record. Contact SIH&S.</p>
        <div className="px-4 pt-4">
          <CallHook />
          <Button type="button" variant="outline" full className="mt-3" onClick={() => navigate({ to: "/home" })}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const label = customerStatusLabel(booking.status, booking.customerLabel);
  const depositReady = label === "Confirmed—deposit required" && !booking.depositPaid;
  const completed = booking.status === "completed";
  const canceled = booking.status === "canceled";
  const restricted = RESTRICTED_MEDIA_SLUGS.has(booking.serviceSlug);
  const photos = JOB_PHOTOS[booking.serviceSlug] ?? [towingPhoto, afterTow];
  const facts = [
    ["Requester", booking.requesterName || "Not entered"],
    ["Organization", booking.organizationLabel || "Not linked"],
    ["Property address", booking.propertyAddress || "Not entered"],
    ["Service location", booking.serviceLocation || booking.pickupLocation || "Not entered"],
    ["Timing", booking.when],
    ["Vehicle", booking.vehicleSummary || "Not entered"],
    ["Callback", booking.callback || "Not entered"],
    ["Payment", booking.paymentSummary || booking.quote || "No payment recorded"],
  ];
  const history = booking.statusHistory?.length
    ? booking.statusHistory
    : [{ at: "", label, source: "customer" as const }];

  return (
    <div>
      <ScreenHeader title="Request" backTo="/bookings" />
      <div className="space-y-4 px-4 pb-8 text-sm">
        <div>
          <p className="text-muted-foreground">Request {booking.id}</p>
          <h2 className="text-xl font-semibold">{booking.serviceTitle}</h2>
          <p className="mt-2 inline-flex rounded-md bg-[#5fbb3f] px-2 py-1 text-xs font-semibold text-[#001e16]">{label}</p>
        </div>

        <section className="rounded-[16px] border border-white/15 bg-[#06281f] p-3">
          <h3 className="font-semibold">{completed ? "Completed job" : canceled ? "Canceled job" : "Request record"}</h3>
          <dl className="mt-3 space-y-2">
            {facts.map(([name, value]) => (
              <div key={name}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#8fd86f]">{name}</dt>
                <dd className="mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
          {booking.scope && <p className="mt-3 border-t border-white/10 pt-3">{booking.scope}</p>}
          {canceled && (
            <div className="mt-3 space-y-1 border-t border-white/10 pt-3">
              <p>Reason: {booking.cancelReason || "Not recorded"}</p>
              <p>{REFUND_LINE}</p>
              {booking.depositDispatched && <p>{DEPOSIT_EARNED}</p>}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-base font-semibold">Status timeline</h3>
          <ol className="mt-3 space-y-0">
            {visibleSteps(history).map((event) => {
              const stamp = formatStamp(event.at);
              return (
                <li key={event.label} className="relative border-l border-white/15 pb-4 pl-4 last:pb-0">
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[#5fbb3f]" aria-hidden />
                  <p className="font-semibold">{event.label}</p>
                  <p className="text-[#f4f7f5]">{stamp ? `${stamp.date} · ${stamp.time}` : "Date and time not recorded"}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {booking.completionPhotosShared && !restricted && (
          <section>
            <h3 className="text-base font-semibold">Completion photos</h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#8fd86f]">Shared by SIH&S</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                ["Shared photo", photos[0]],
                ["Shared photo", photos[1]],
              ].map(([caption, src], index) => (
                <figure key={`${caption}${index}`} className="overflow-hidden rounded-[16px] border border-white/15 bg-[#06281f]">
                  <img src={src} alt="" className="h-36 w-full object-cover" />
                  <figcaption className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-[#8fd86f]">{caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-md border border-border bg-card p-3">
          <h3 className="font-semibold">Scope</h3>
          <p className="mt-1">{booking.scope || "SIH&S has not added a confirmed scope yet."}</p>
          <p className="mt-3 font-semibold">Location</p>
          <p>Property address: {booking.propertyAddress || "Not entered"}</p>
          <p>Actual service location: {booking.serviceLocation || booking.pickupLocation || "Not entered"}</p>
          <Art kind="map" className="mt-3 h-32 w-full rounded-md" />
          <p className="mt-3 font-semibold">Assigned company or person</p>
          <p>SIH&S. Live worker location is not shown.</p>
          {booking.tasks && booking.tasks.length > 0 && (
            <>
              <p className="mt-3 font-semibold">Tasks</p>
              <ul className="mt-1 list-disc pl-5">
                {booking.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            </>
          )}
          {booking.completionRequirements && booking.completionRequirements.length > 0 && (
            <>
              <p className="mt-3 font-semibold">Completion requirements</p>
              <ul className="mt-1 list-disc pl-5">
                {booking.completionRequirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {booking.eta && (
            <p className="mt-3">Estimated arrival: {booking.eta}. Estimate only; not a guaranteed arrival time.</p>
          )}
        </section>

        <section className="rounded-md border border-border bg-card p-3">
          <h3 className="font-semibold">Change history</h3>
          {(booking.changeHistory ?? []).length === 0 ? (
            <p className="mt-1 text-muted-foreground">No postponement, cancellation, reassignment, or crew substitution is on this request.</p>
          ) : (
            <ol className="mt-2 space-y-2">
              {booking.changeHistory?.map((entry) => (
                <li key={`${entry.at}${entry.kind}`}>
                  <p className="font-semibold">{entry.kind}</p>
                  <p>{entry.body}</p>
                  <p className="text-xs text-muted-foreground">{new Date(entry.at).toLocaleString()}</p>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="rounded-md border border-border bg-card p-3">
          <h3 className="font-semibold">Documents</h3>
          <p className="mt-1">Only files SIH&S has released to you appear here. Internal notes, claims, and notary journal entries are not shown.</p>
        </section>

        <p className="text-sm text-[#c5d4cc]">Status changes stay on the timeline above. A later change to the place, time, or scope is added there and the original request stays on this record.</p>

        <section className="rounded-md border border-border bg-card p-3">
          <h3 className="font-semibold">Linked work orders</h3>
          <ul className="mt-2 space-y-2">
            {(booking.linkedWork ?? [{ id: booking.id, service: booking.serviceTitle, status: label }]).map((row) => (
              <li key={row.id} className="flex items-start justify-between gap-3">
                <span>
                  <span className="block font-semibold">{row.id}</span>
                  <span className="block">{row.service}</span>
                </span>
                <span className="rounded-md bg-[#5fbb3f] px-2 py-1 text-xs font-semibold text-[#001e16]">{row.status}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-muted-foreground">Completing one service does not close the whole request.</p>
        </section>

        <section className="rounded-md border border-border bg-card p-3">
          <h3 className="font-semibold">Payments</h3>
          {depositReady ? (
            <>
              <p className="mt-1">{booking.quote || "Quote confirmed by SIH&S before deposit."}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Powered by Square</p>
              <p className="mt-1">You are completing payment through Square-hosted checkout.</p>
              <p className="mt-2">{DEPOSIT_EARNED}</p>
              <p className="mt-1">{REFUND_LINE}</p>
              <Button type="button" full className="mt-3" onClick={() => { setPayFailed(false); setPayOpen("deposit"); }}>Pay Deposit (Square)</Button>
              <Button type="button" variant="outline" full className="mt-2" onClick={() => { setPayFailed(false); setPayOpen("balance"); }}>Pay Balance (Square)</Button>
            </>
          ) : (
            <p className="mt-1">
              {booking.paymentSummary || "The deposit step appears after SIH&S confirms this request. No card number is collected here."}
            </p>
          )}
          {booking.depositPaid && <p className="mt-2">Deposit reference {booking.squareRef}.</p>}
        </section>

        {booking.sharedTitle && (
          <section className="rounded-md border border-border bg-card p-3">
            <h3 className="font-semibold">Shared with you</h3>
            <p className="mt-1">{booking.sharedTitle}</p>
            <p>Sender: SIH&S</p>
            {booking.sharedAcknowledgedAt ? (
              <p>Acknowledged on {new Date(booking.sharedAcknowledgedAt).toLocaleString()}.</p>
            ) : (
              <Button type="button" className="mt-3" onClick={() => acknowledgeShared(booking.id)}>Acknowledge Receipt</Button>
            )}
          </section>
        )}

        {(booking.serviceSlug === "dna" || booking.serviceSlug === "drug-alcohol") && completed && (
          <p className="rounded-md border border-border bg-card p-3">Collection completed—laboratory review pending (third party).</p>
        )}

        {booking.delivered && !booking.acceptedByCustomer && (
          <section className="rounded-md border border-border bg-card p-3">
            <h3 className="font-semibold">Delivery</h3>
            <p className="mt-1">Delivered by SIH&S. Customer accepted is a separate step.</p>
            <Button type="button" full className="mt-3" onClick={() => acceptDelivery(booking.id)}>Accept Delivery</Button>
            <label className="mt-3 block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Report an issue</span>
              <select className="min-h-11 w-full rounded-xl border border-border bg-card px-3" value={issue} onChange={(e) => setIssue(e.target.value)}>
                <option value="">Choose a category</option>
                <option>Partial delivery</option>
                <option>Shortage</option>
                <option>Damage</option>
                <option>Refusal</option>
                <option>Return</option>
              </select>
            </label>
            <Button type="button" variant="outline" full className="mt-2" disabled={!issue} onClick={() => reportDeliveryIssue(booking.id, issue)}>
              Report an Issue
            </Button>
          </section>
        )}

        {booking.authorizationPending && (
          <p className="rounded-md border border-border bg-card p-3">A general service request is not sufficient for private-property towing. SIH&S must verify authorization before any vehicle removal.</p>
        )}

        {(booking.syncStatus === "saved-locally" || booking.syncStatus === "uploading") && (
          <p className="rounded-md border border-border bg-card p-3">
            {booking.syncStatus === "saved-locally"
              ? "Saved locally. The request has not been received yet."
              : "Request received—media upload pending."}{" "}
            <button type="button" className="font-semibold text-accent-text underline" onClick={() => retrySync(booking.id)}>
              Retry
            </button>
          </p>
        )}

        {booking.customerLabel === "Needs your input" && (
          <p className="rounded-md border border-border bg-card p-3">SIH&S needs more information before this request can be confirmed. Add a note below. This does not dispatch staff.</p>
        )}
        {booking.customerLabel === "Needs approval" && (
          <p className="rounded-md border border-border bg-card p-3">This request is above your approval limit. An authorized approver must review it. It is not confirmed.</p>
        )}
        {booking.customerLabel === "Approval declined" && (
          <p className="rounded-md border border-border bg-card p-3">Approval declined. SIH&S has the decision. The request is not confirmed and staff are not dispatched.</p>
        )}

        {infoOpen && (
          <form
            className="rounded-md border border-border bg-card p-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!info.trim()) return;
              addInformation(booking.id, info.trim());
              setInfo("");
              setInfoOpen(false);
            }}
          >
            <label className="block text-sm font-semibold" htmlFor="add-info">Add information</label>
            <textarea id="add-info" className="mt-2 min-h-24 w-full rounded-md border border-border bg-transparent p-2" value={info} onChange={(event) => setInfo(event.target.value)} />
            <Button type="submit" className="mt-2">Save note</Button>
          </form>
        )}
        {followUpId && <p role="status">Return visit {followUpId} is received and pending SIH&S confirmation.</p>}

        <div className="space-y-2">
          <Button type="button" variant="outline" full onClick={() => setInfoOpen(true)}>Add Information</Button>
          <CallHook />
          <button type="button" className="min-h-11 font-semibold text-accent-text underline" onClick={() => navigate({ to: "/incident" })}>Report a Concern</button>
          {booking.status !== "completed" && booking.status !== "canceled" && booking.status !== "cancellation-requested" && (
            <button type="button" className="block min-h-11 font-semibold text-danger underline" onClick={() => setCancelOpen(true)}>Request Cancellation</button>
          )}
          {completed && (
            <Button
              type="button"
              full
              disabled={Boolean(followUpId)}
              onClick={() => setFollowUpId(requestFollowUp(booking.id))}
            >
              Request Return Visit / Report an Issue
            </Button>
          )}
          <Button type="button" variant="outline" full onClick={() => navigate({ to: "/home" })}>Return Home</Button>
        </div>
      </div>
      {payOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="pay-title">
          <div className="w-full max-w-[480px] rounded-t-[16px] bg-[#06281f] p-4">
            <h2 id="pay-title" className="text-xl font-semibold">{payOpen === "deposit" ? "Pay Deposit (Square)" : "Pay Balance (Square)"}</h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Powered by Square</p>
            <p className="mt-2 text-sm">You are completing payment through Square-hosted checkout. No card number is entered in SIH&S.</p>
            {payFailed && (
              <p className="mt-3 rounded-md border border-border p-3 text-sm" role="alert">
                Payment not completed through Square. Retry, or call SIH&S. The request stays unconfirmed until payment is finished.
              </p>
            )}
            <Button
              type="button"
              full
              className="mt-4"
              onClick={() => {
                recordDeposit(booking.id, payOpen);
                setPayOpen(null);
                setPayFailed(false);
              }}
            >
              Continue in Square
            </Button>
            <button type="button" className="mt-2 min-h-11 w-full font-semibold" onClick={() => setPayFailed(true)}>
              Payment not completed
            </button>
            <div className="mt-2">
              <CallHook />
            </div>
            <button type="button" className="mt-1 min-h-11 w-full" onClick={() => setPayOpen(null)}>Close</button>
          </div>
        </div>
      )}
      {cancelOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" role="dialog" aria-modal="true">
          <div className="w-full max-w-[480px] rounded-t-[16px] bg-[#06281f] p-4">
            <h2 className="text-xl font-semibold">Request Cancellation</h2>
            <Button type="button" full className="mt-4" onClick={() => { cancelBooking(booking.id); setCancelOpen(false); }}>Request Cancellation</Button>
            <button type="button" className="mt-2 min-h-11 w-full" onClick={() => setCancelOpen(false)}>Keep request</button>
          </div>
        </div>
      )}
    </div>
  );
}
