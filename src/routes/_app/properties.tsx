import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/Chrome";
import { Button, Field, Textarea } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/properties")({
  head: () => ({ meta: [{ title: "SIH&S — Properties" }] }),
  component: PropertiesScreen,
});

function PropertiesScreen() {
  const { user } = useApp();
  const [note, setNote] = useState("");
  const [sent, setSent] = useState("");
  const linked = user?.organizationAccess === "linked";

  if (!linked) {
    return (
      <div>
        <ScreenHeader title="Properties" backTo="/profile" />
        <p className="px-4 text-sm">Properties appear after SIH&S links this account to an organization.</p>
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
          <p className="mt-2 text-muted-foreground">Service entrance: Suite 7724. Access notes stay with the property record.</p>
        </section>
        <section className="rounded-md border border-border bg-card p-4">
          <h2 className="font-semibold">Authorized requesters</h2>
          <p className="mt-1">{user?.fullName} · view and request</p>
          <p className="mt-2 text-muted-foreground">Edits are sent to SIH&S. They do not change the record immediately.</p>
        </section>
        <section className="rounded-md border border-border bg-card p-4">
          <h2 className="font-semibold">Approval limit</h2>
          <p className="mt-1">{user?.approvalLimit}. Requests above this limit show Needs approval.</p>
        </section>
        <section className="rounded-md border border-border bg-card p-4">
          <h2 className="font-semibold">Contracts and purchase orders</h2>
          <p className="mt-1">PO-2041 · Active · linked to request SIHS-104218</p>
        </section>
        <section className="rounded-md border border-border bg-card p-4">
          <h2 className="font-semibold">Recurring schedules</h2>
          <p className="mt-1">R-18 · Weekly janitorial · SIH&S · pending confirmation for any skip.</p>
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
