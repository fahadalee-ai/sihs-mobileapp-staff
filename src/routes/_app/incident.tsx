import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Art } from "@/components/Art";
import { CallHook, ScreenHeader } from "@/components/Chrome";
import { Button, Field, Input, Textarea } from "@/components/kit";
import { PHONE_DISPLAY } from "@/lib/content";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/incident")({
  head: () => ({ meta: [{ title: "SIH&S — Report a concern" }] }),
  component: IncidentReport,
});

const TYPES = ["Service complaint", "Safety concern", "Property damage", "Vehicle accident", "Injury or illness", "Other"];

function IncidentReport() {
  const { submitIncident, incidents, bookings } = useApp();
  const [type, setType] = useState(TYPES[0]);
  const [details, setDetails] = useState("");
  const [requestId, setRequestId] = useState("");
  const [place, setPlace] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [error, setError] = useState("");
  const [ref, setRef] = useState("");

  return (
    <div>
      <ScreenHeader title="Help" backTo="/profile" />
      <section className="px-4 pb-4">
        <h2 className="text-base font-semibold">How a request works</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[#c5d4cc]">
          <li>You submit a request. That does not dispatch a crew or confirm a time.</li>
          <li>SIH&S reviews it and calls the callback number on the request.</li>
          <li>A quote or deposit appears only after SIH&S confirms the request.</li>
          <li>Call {PHONE_DISPLAY} if you need someone now.</li>
        </ol>
      </section>
      <form
        className="px-4 pb-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!details.trim()) {
            setError("Describe the concern.");
            return;
          }
          setError("");
          const located = [details.trim(), place.trim() ? `Location: ${place.trim()}` : "", photoName ? `Photo attached: ${photoName}` : ""]
            .filter(Boolean)
            .join(" ");
          setRef(submitIncident({ type, details: located, restricted: false, requestId }));
        }}
      >
        <div className="mb-4 rounded-[16px] border border-white/15 bg-[#06281f] p-4">
          <p className="text-sm font-semibold">If anyone is in danger, call 911 first.</p>
          <div className="mt-2">
            <CallHook />
          </div>
        </div>
        <Field label="Category" error={error || undefined}>
          <select className="min-h-11 w-full rounded-xl border border-border bg-card px-3" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Description">
          <Textarea value={details} onChange={(e) => setDetails(e.target.value)} />
        </Field>
        <Field label="Location (optional)">
          <Input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Address or place name. GPS is not required." />
        </Field>
        <Field label="Photos (optional)">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm"
            onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")}
          />
          {photoName && <span className="mt-1 block text-xs text-muted-foreground">{photoName} attached. This is not a claim.</span>}
        </Field>
        <Field label="Related request (optional)">
          <select className="min-h-11 w-full rounded-xl border border-border bg-card px-3" value={requestId} onChange={(e) => setRequestId(e.target.value)}>
            <option value="">None</option>
            {bookings.map((item) => (
              <option key={item.id} value={item.id}>{item.id} · {item.serviceTitle}</option>
            ))}
          </select>
        </Field>
        <p className="mb-4 text-sm text-muted-foreground">Do not include medical or other sensitive details if you can avoid it. SIH&S will contact you. Submitting a concern is not a claim submission.</p>
        <Button type="submit" full>Submit concern</Button>
        {ref && (
          <p className="mt-4 text-sm font-semibold" role="status">Concern received. Reference {ref}.</p>
        )}
      </form>
      <section className="px-4 pb-8">
        <h2 className="text-base font-semibold">My Concerns</h2>
        {incidents.length === 0 ? (
          <div className="mt-2 text-center">
            <Art kind="empty" className="mx-auto h-32 w-full" />
            <p className="text-sm text-muted-foreground">No concerns yet.</p>
          </div>
        ) : (
          <ul className="mt-2 space-y-2">
            {incidents.map((item) => (
              <li key={item.id} className="rounded-md border border-border bg-card p-3 text-sm">
                <p className="font-semibold">{item.id} · {item.status ?? "Received"}</p>
                <p>{item.type}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
