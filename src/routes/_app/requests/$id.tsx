import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CallHook, ScreenHeader } from "@/components/Chrome";
import { Button } from "@/components/kit";
import { RESTRICTED_MEDIA_SLUGS, customerStatusLabel } from "@/lib/customer-config";
import { DEPOSIT_EARNED, REFUND_LINE } from "@/lib/content";
import { useApp, type Booking } from "@/lib/store";
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

function staffNotes(booking: Booking) {
  if (booking.staffNotes?.length) return booking.staffNotes;
  const at = booking.statusHistory?.[0]?.at ?? "";
  const notes = [
    {
      at,
      author: "SIH&S",
      body: `${booking.serviceTitle} is on file. A preferred time is not a confirmed appointment, and this note does not dispatch a crew.`,
    },
  ];
  if (booking.scope) notes.push({ at, author: "SIH&S", body: booking.scope });
  if (booking.authorizationPending) {
    notes.push({
      at,
      author: "SIH&S",
      body: "Private-property towing authorization is pending verification. The vehicle has not been approved for removal.",
    });
  }
  for (const event of booking.statusHistory ?? []) {
    if (event.source === "sihs") notes.push({ at: event.at, author: "SIH&S", body: event.label });
  }
  if (booking.status === "completed") {
    notes.push(
      { at, author: "SIH&S crew", body: "Before photos were taken at the service location before work started." },
      { at, author: "SIH&S crew", body: "Work is complete. After photos were added. The original request is still on this record." },
    );
  }
  if (booking.status === "canceled") {
    notes.push({
      at: booking.statusHistory?.at(-1)?.at ?? at,
      author: "SIH&S",
      body: `Canceled. Reason: ${booking.cancelReason || "Not recorded"}. Before and after photos were not taken.`,
    });
  }
  return notes;
}

function RequestDetail() {
  const { id } = Route.useParams();
  const { bookings, cancelBooking, recordDeposit, acceptDelivery, reportDeliveryIssue, acknowledgeShared } = useApp();
  const navigate = useNavigate();
  const booking = bookings.find((item) => item.id === id);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [issue, setIssue] = useState("");

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
  const notes = staffNotes(booking);

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
            {history.map((event, index) => {
              const stamp = formatStamp(event.at);
              return (
                <li key={`${event.at}${event.label}${index}`} className="relative border-l border-white/15 pb-4 pl-4 last:pb-0">
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[#5fbb3f]" aria-hidden />
                  <p className="font-semibold">{event.label}</p>
                  <p className="text-[#f4f7f5]">{stamp ? `${stamp.date} · ${stamp.time}` : "Date and time not recorded"}</p>
                  <p className="text-xs text-[#c5d4cc]">{event.source === "customer" ? "Customer entered" : "SIH&S"}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <section>
          <h3 className="text-base font-semibold">Job photos</h3>
          <p className="mt-1 text-xs text-[#c5d4cc]">Before and after photos are kept on completed jobs.</p>
          {restricted ? (
            <p className="mt-3 rounded-[16px] border border-white/15 bg-[#06281f] p-3">Photos are not stored for this service.</p>
          ) : booking.photoState === "sample" && completed ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                ["Before", photos[0]],
                ["After", photos[1]],
              ].map(([caption, src]) => (
                <figure key={caption} className="overflow-hidden rounded-[16px] border border-white/15 bg-[#06281f]">
                  <img src={src} alt={`${caption} sample photo for ${booking.serviceTitle}`} className="h-36 w-full object-cover" />
                  <figcaption className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-[#8fd86f]">{caption} · sample</figcaption>
                </figure>
              ))}
            </div>
          ) : (booking.photoCount ?? 0) > 0 ? (
            <p className="mt-3 rounded-[16px] border border-white/15 bg-[#06281f] p-3">
              {booking.photoCount} photos or videos were submitted with this request.
            </p>
          ) : (
            <p className="mt-3 rounded-[16px] border border-dashed border-white/20 bg-[#06281f] p-3 text-[#c5d4cc]">
              {canceled ? "This job was canceled. Before and after photos were not taken." : completed ? "No before or after photos are on this job." : "Before and after photos are added when SIH&S marks the job completed."}
            </p>
          )}
        </section>

        <section>
          <h3 className="text-base font-semibold">Staff notes</h3>
          <ol className="mt-3 space-y-2">
            {notes.map((note, index) => {
              const stamp = formatStamp(note.at);
              return (
                <li key={`${note.body}${index}`} className="rounded-[16px] border border-white/15 bg-[#06281f] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8fd86f]">{note.author}</p>
                  <p className="mt-1">{note.body}</p>
                  <p className="mt-2 text-xs text-[#c5d4cc]">{stamp ? `${stamp.date} · ${stamp.time}` : "Date and time not recorded"}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="rounded-md border border-border bg-card p-3">
          <h3 className="font-semibold">Scope</h3>
          <p className="mt-1">{booking.scope || "SIH&S has not added a confirmed scope yet."}</p>
          <p className="mt-3 font-semibold">Location</p>
          <p>Property address: {booking.propertyAddress || "Not entered"}</p>
          <p>Actual service location: {booking.serviceLocation || booking.pickupLocation || "Not entered"}</p>
          <p className="mt-3 font-semibold">Assigned company</p>
          <p>SIH&S. Live worker location is not shown.</p>
          {booking.customerLabel === "Confirmed—deposit required" && (
            <p className="mt-3">Estimate only; not a guaranteed arrival time. SIH&S has not published an arrival estimate.</p>
          )}
        </section>

        <p className="text-sm text-[#c5d4cc]">Status changes stay on the timeline above. A later change to the place, time, or scope is added there and the original request stays on this record.</p>

        <section className="rounded-md border border-border bg-card p-3">
          <h3 className="font-semibold">Linked work</h3>
          <p className="mt-1">{booking.serviceTitle} · {label}</p>
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
              <Button type="button" full className="mt-3" onClick={() => recordDeposit(booking.id, "deposit")}>Pay Deposit (Square)</Button>
              <Button type="button" variant="outline" full className="mt-2" onClick={() => recordDeposit(booking.id, "balance")}>Pay Balance (Square)</Button>
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

        {(booking.serviceSlug === "dna" || booking.serviceSlug === "drug-alcohol") && (
          <p className="rounded-md border border-border bg-card p-3">Collection completed—laboratory review pending (third party). Results are not shown in the app.</p>
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

        <div className="space-y-2">
          <CallHook />
          <button type="button" className="min-h-11 font-semibold text-accent-text underline" onClick={() => navigate({ to: "/incident" })}>Report a concern</button>
          {booking.status !== "completed" && booking.status !== "canceled" && booking.status !== "cancellation-requested" && (
            <button type="button" className="block min-h-11 font-semibold text-danger underline" onClick={() => setCancelOpen(true)}>Request cancellation</button>
          )}
          <Button type="button" variant="outline" full onClick={() => navigate({ to: "/home" })}>Return Home</Button>
        </div>
      </div>
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
