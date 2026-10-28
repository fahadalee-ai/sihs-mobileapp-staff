import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/Chrome";
import { Button, Field, Input, Textarea } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/organization")({
  head: () => ({ meta: [{ title: "SIH&S — Organization access" }] }),
  component: OrganizationAccess,
});

function OrganizationAccess() {
  const { user, requestOrganizationAccess } = useApp();
  const [organization, setOrganization] = useState("");
  const [property, setProperty] = useState("");
  const [note, setNote] = useState("");
  const pending = user?.organizationAccess === "pending";

  return (
    <div>
      <ScreenHeader title="Request organization access" backTo="/profile" />
      <form
        className="px-4 pb-8"
        onSubmit={(e) => {
          e.preventDefault();
          requestOrganizationAccess({
            organization: organization.trim() || "Organization",
            property: property.trim(),
            note: note.trim(),
          });
        }}
      >
        <p className="mb-4 text-sm text-muted-foreground">Submitting this request does not link properties. SIH&S verifies the organization first.</p>
        <Field label="Organization name">
          <Input value={organization} onChange={(e) => setOrganization(e.target.value)} />
        </Field>
        <Field label="Property name and address">
          <Input value={property} onChange={(e) => setProperty(e.target.value)} />
        </Field>
        <Field label="Note">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <Button type="submit" full disabled={pending}>Submit request</Button>
        {pending && <p className="mt-4 text-sm font-semibold" role="status">Pending SIH&S verification.</p>}
      </form>
    </div>
  );
}
