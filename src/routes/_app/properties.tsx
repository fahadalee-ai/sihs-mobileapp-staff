import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Art } from "@/components/Art";
import { ScreenHeader } from "@/components/Chrome";
import { Button, Field, Input, Textarea } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/properties")({
  head: () => ({ meta: [{ title: "SIH&S — Properties" }] }),
  component: PropertiesScreen,
});

function PropertiesScreen() {
  const { user, bookings, decideApproval } = useApp();
  const [note, setNote] = useState("");
  const [sent, setSent] = useState("");
  const [change, setChange] = useState("");
  const [changeSent, setChangeSent] = useState("");
  const [decisionNote, setDecisionNote] = useState("");
  const [decision, setDecision] = useState("");
  const linked = user?.organizationAccess === "linked";
  const approval = bookings.find((item) => item.id === "SIHS-101055")
    ?? bookings.find((item) => item.customerLabel === "Needs approval" || item.customerLabel === "Approval declined");

  if (!linked) {
    return (
      <div>
        <ScreenHeader title="Properties" backTo="/profile" />
        <div className="px-4 text-center">
          <Art kind="empty" className="mx-auto h-36 w-full" />
          <p className="text-sm">No properties yet. Properties appear after SIH&S links this account to an organization.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="Properties and Organization" backTo="/profile" />
      <div className="space-y-4 px-4 pb-8 text-sm">
        <section className="rounded-md border border-border bg-card p-4">
          <h2 className="font-semibold">Wilmington office</h2>
          <p className="mt-1">1201 N. Orange St., Suite 7724, Wilmington, DE 19801</p>
          <p className="mt-2 text-muted-foreground">Service entrance: Suite 7724 lobby. Access notes: check in at reception.</p>
        </section>
        <section className="rounded-md border border-border bg-card p-4">
          <h2 className="font-semibold">Market Street lot</h2>
          <p className="mt-1">1007 N. Market St., Wilmington, DE 19801</p>
          <p className="mt-2 text-muted-foreground">Service entrance: visitor lot, row C. Access notes: use the Market Street gate.</p>
        </section>
        <section className="rounded-md border border-border bg-card p-4">
          <h2 className="font-semibold">Authorized requesters</h2>
          <p className="mt-1">{user?.fullName} · view and request</p>
          <p className="mt-1">Additional requester · view only</p>
          <p className="mt-2 text-muted-foreground">Edits submit a request change to SIH&S. They do not change the record immediately.</p>
          <Field label="Request change">
            <Input value={change} onChange={(e) => setChange(e.target.value)} placeholder="What should SIH&S review?" />
          </Field>
          <Button type="button" onClick={() => setChangeSent("Request change submitted. Pending SIH&S confirmation.")}>Submit request change</Button>
          {changeSent && <p className="mt-2 font-semibold" role="status">{changeSent}</p>}
        </section>
        <section className="rounded-md border border-border bg-card p-4">
          <h2 className="font-semibold">Approval limit</h2>
          <p className="mt-1">{user?.approvalLimit}. Requests above this limit show Needs approval and notify an authorized approver.</p>
        </section>
        {approval && (
          <section className="rounded-md border border-border bg-card p-4">
            <h2 className="font-semibold">Approval</h2>
            <p className="mt-1">{approval.id} · {approval.serviceTitle}</p>
            <p className="mt-1">{approval.quote || "Estimated cost pending."}</p>
            <p className="mt-1">{approval.scope}</p>
            <p className="mt-2 font-semibold">{approval.customerLabel}</p>
            {approval.customerLabel === "Needs approval" && (
              <>
                <Field label="Note">
                  <Textarea value={decisionNote} onChange={(e) => setDecisionNote(e.target.value)} />
                </Field>
                <div className="flex gap-2">
                  <Button type="button" onClick={() => { decideApproval(approval.id, "approved", decisionNote); setDecision("Approved. The request is still pending SIH&S confirmation."); }}>Approve</Button>
                  <Button type="button" variant="outline" onClick={() => { decideApproval(approval.id, "declined", decisionNote); setDecision("Approval declined. The request is not confirmed."); }}>Decline</Button>
                </div>
              </>
            )}
            {decision && <p className="mt-2 font-semibold" role="status">{decision}</p>}
          </section>
        )}
        <section className="rounded-md border border-border bg-card p-4">
          <h2 className="font-semibold">Contracts and purchase orders</h2>
          <p className="mt-1">PO-2041 · Active · linked to SIHS-101055</p>
        </section>
        <section className="rounded-md border border-border bg-card p-4">
          <h2 className="font-semibold">Recurring schedules</h2>
          <p className="mt-1">R-18 · Weekly janitorial · Wilmington office</p>
          <p className="mt-1">Scope: common areas and restrooms. Server room excluded.</p>
          <p>Assigned company or person: SIH&S</p>
          <p>Tasks: vacuum, restrooms, trash.</p>
          <p>Completion requirements: skip no-photo areas and leave a completion note.</p>
          <p className="mt-2 text-muted-foreground">A change or skip is a request. It is pending SIH&S confirmation.</p>
          <Field label="Request a change or skip">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <Button type="button" onClick={() => setSent("Pending SIH&S confirmation.")}>Submit request</Button>
          {sent && <p className="mt-2 font-semibold" role="status">{sent}</p>}
        </section>
      </div>
    </div>
  );
}
