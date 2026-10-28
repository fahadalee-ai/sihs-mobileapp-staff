import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/Chrome";
import { Button, Field, Input, Textarea } from "@/components/kit";
import { LAB_LINE, PATENT_FOOTNOTE } from "@/lib/staff-data";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app/service/$id")({
  head: () => ({ meta: [{ title: "SIH&S — Service steps" }] }),
  component: ServiceSteps,
});

function ServiceSteps() {
  const { id } = Route.useParams();
  const { jobs, advance } = useStaff();
  const job = jobs.find((item) => item.id === id);
  const [journal, setJournal] = useState(false);
  const [consent, setConsent] = useState(false);
  const [accepted, setAccepted] = useState(job?.customerAccepted ?? false);

  if (!job) {
    return (
      <div>
        <ScreenHeader title="Service" backTo="/jobs" />
        <p className="px-4 text-sm">You don't have access to this record. Contact SIH&S.</p>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="Service steps" backTo="/jobs" />
      <div className="space-y-4 px-4 pb-8 text-sm">
        <h2 className="text-xl font-semibold">{job.service}</h2>
        <p className="text-[#c5d4cc]">{job.id}</p>
        {job.service.includes("HOOK & TEST") && <p className="text-xs text-[#c5d4cc]">{PATENT_FOOTNOTE}</p>}

        {job.functionCode === "TOW" && (
          <>
            <section className="rounded-md border border-white/15 p-3">
              <h3 className="font-semibold">Request authority</h3>
              <p className="mt-1">{job.authority || "Not recorded"}</p>
              {job.privateProperty && !job.authVerified && <p className="mt-2 font-semibold">Private-property authorization required.</p>}
            </section>
            <section className="rounded-md border border-white/15 p-3">
              <h3 className="font-semibold">Vehicle condition</h3>
              <p>Existing damage, wheels, steering, and rollability are recorded with fresh in-app photos.</p>
              <p className="mt-2">{job.vehicle}</p>
            </section>
            <section className="rounded-md border border-white/15 p-3">
              <h3 className="font-semibold">Equipment compatibility</h3>
              <p>{job.equipmentWarning || "Wheel-lift matches this light-duty vehicle."}</p>
            </section>
            <section className="rounded-md border border-white/15 p-3">
              <h3 className="font-semibold">Route record</h3>
              <p>Pickup: {job.pickup || job.serviceLocation}</p>
              <p>Destination: {job.destination || "Not entered"}</p>
              <p>Handoff, operator, and outcome are added when the move ends.</p>
            </section>
            {job.service === "Jump Start" && <p>Jump start checklist: battery check, cable connection, vehicle start result, safety steps.</p>}
            {job.service === "Fuel Delivery" && <p>Fuel delivery checklist: fuel type, quantity, vehicle fuel compatibility, spill precautions, delivery confirmation.</p>}
            {job.service.includes("Lockout") && <p>Lockout checklist: point of entry, no damage noted, keys returned to the requester.</p>}
          </>
        )}

        {job.functionCode === "XPT" && (
          <>
            <p className="rounded-md border border-white/15 p-3">Client employee (passenger). This person is not an SIH&S staff account. ID check result is recorded. ID numbers are not shown.</p>
            <ol className="space-y-2">
              {(job.legs ?? []).map((leg) => (
                <li key={leg.name} className="rounded-md border border-white/15 p-3">
                  <p className="font-semibold">{leg.name}</p>
                  <p>{leg.place}</p>
                  <p className="text-xs text-[#c5d4cc]">{leg.status} · Source: Dispatcher-entered</p>
                </li>
              ))}
            </ol>
          </>
        )}

        {(job.functionCode === "COL" || job.functionCode === "DNA") && (
          <>
            <p>{LAB_LINE}</p>
            <p>Program: {job.program}. Timing rules are set per program.</p>
            <p>Participants: {job.participants}</p>
            <p>Designated laboratory: {job.lab}</p>
            <p>Authorized recipients: {job.recipients}</p>
            <section className="rounded-md border border-white/15 p-3">
              <h3 className="font-semibold">Official form required</h3>
              <p className="mt-1">Open the program form or upload the completed form. This app does not replace it.</p>
              <div className="mt-3 flex gap-2">
                <Button type="button">Open</Button>
                <Button type="button" variant="outline">Upload Completed Form</Button>
              </div>
            </section>
            <p>Specimen transfer records the person and time of each handoff.</p>
            <p>Collection completed — laboratory review pending (third party). Results are not shown.</p>
          </>
        )}

        {job.functionCode === "NOT" && (
          <>
            <section className="rounded-md border border-white/15 p-3">
              <p className="font-semibold">Delaware mobile, in-person notary service only.</p>
              <p className="mt-1">Client name stays on the appointment. Document category only. No document photos.</p>
              <p className="mt-1">{job.serviceLocation} · {job.when}</p>
            </section>
            {!journal ? (
              <Button type="button" onClick={() => setJournal(true)}>Open Notary Journal — Restricted</Button>
            ) : (
              <section className="rounded-md border border-white/15 p-3">
                <h3 className="font-semibold">Notary Journal</h3>
                <p className="mt-1">Extra confirmation is required. Journal entries are never merged with the appointment record.</p>
                <label className="mt-3 flex items-start gap-3">
                  <input type="checkbox" className="mt-1 h-5 w-5" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>I am the commissioned notary opening my own journal.</span>
                </label>
                {consent ? <p className="mt-2">Journal is empty for this preview. Entries stay restricted.</p> : <p className="mt-2">Not started until confirmation is checked.</p>}
              </section>
            )}
          </>
        )}

        {job.functionCode === "LAW" && (
          <>
            <h3 className="font-semibold">Area checklist</h3>
            <ul className="list-disc pl-5">
              <li>Designated interior zones, floors 1 and 2</li>
              <li>Exclusions: {job.exclusions}</li>
              <li>No-camera zone: server room. The camera stays off there.</li>
              <li>Final cleanup and security check</li>
            </ul>
            <p>Before photos cover designated areas and existing damage. After photos use the before image as a reference.</p>
          </>
        )}

        {job.functionCode === "CUR" && (
          <>
            <ul className="space-y-2">
              {(job.items ?? []).map((item) => (
                <li key={item.name} className="rounded-md border border-white/15 p-3">
                  <p className="font-semibold">{item.name}</p>
                  <p>Quantity {item.qty}</p>
                  <p>Handoff: {item.handoff}</p>
                </li>
              ))}
            </ul>
            <p>Delivered and Customer accepted stay separate.</p>
            <p>Delivered: {job.delivered ? "Yes" : "No"}. Customer accepted: {accepted ? "Yes" : "No"}.</p>
            <Field label="Recipient name">
              <Input defaultValue="Reception" />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={() => { setAccepted(true); advance(job.id, { customerAccepted: true }); }}>Mark customer accepted</Button>
              {["Partial delivery", "Shortage", "Damage", "Refusal", "Return"].map((item) => (
                <Button key={item} type="button" variant="outline">{item}</Button>
              ))}
            </div>
          </>
        )}

        {job.functionCode === "PIM" && <p>Open the PIM-VEE™ workspace from the job. This screen does not collect fault or cause.</p>}
        {job.functionCode === "OFC" && <p>Office support uses the daily log. This role does not open a field job.</p>}
      </div>
    </div>
  );
}
