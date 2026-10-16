import { createFileRoute } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/Chrome";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/access")({
  head: () => ({ meta: [{ title: "SIH&S — Access" }] }),
  component: AccessScreen,
});

function AccessScreen() {
  const { user } = useApp();
  return (
    <div>
      <ScreenHeader title="Roles and Access" backTo="/profile" />
      <div className="space-y-3 px-4 pb-8 text-sm">
        <p>Access is assigned by SIH&S. These values cannot be changed in the app.</p>
        <dl className="space-y-3 rounded-md border border-border bg-card p-4">
          <div>
            <dt className="text-muted-foreground">Organization</dt>
            <dd className="font-semibold">{user?.organizationAccess === "linked" ? user.organization : "Not linked"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Linked properties</dt>
            <dd className="font-semibold">{user?.organizationAccess === "linked" ? "Wilmington office" : "None"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Authorized requester</dt>
            <dd className="font-semibold">{user?.authorizedRequester ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Approval limit</dt>
            <dd className="font-semibold">{user?.approvalLimit ?? "Not assigned"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
