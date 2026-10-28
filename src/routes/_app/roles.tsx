import { createFileRoute } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/Chrome";
import { functionTitle } from "@/lib/staff-data";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app/roles")({
  head: () => ({ meta: [{ title: "SIH&S — Roles and access" }] }),
  component: Roles,
});

function Roles() {
  const { user } = useStaff();
  return (
    <div>
      <ScreenHeader title="My Roles and Access" backTo="/profile" />
      <div className="space-y-3 px-4 pb-8 text-sm">
        <p>Roles are assigned by SIH&S. These values are read-only.</p>
        <p className="font-semibold">Approved roles</p>
        <ul className="flex flex-wrap gap-2">
          {(user?.approvedRoles ?? []).map((code) => (
            <li key={code} className="rounded-md bg-[#5fbb3f] px-2 py-1 text-xs font-semibold text-[#001e16]">{functionTitle(code)}</li>
          ))}
        </ul>
        <p>Requested roles are not used for access: {(user?.requestedRoles ?? []).map(functionTitle).join(", ")}</p>
        <p>Organization: {user?.organization}</p>
        <p>Properties: {(user?.properties ?? []).join(", ") || "None assigned"}</p>
        <p>Supervisor: {user?.supervisor}</p>
        {user?.supervisorFlag && <p>Crew view is included because SIH&S approved a supervisor assignment.</p>}
      </div>
    </div>
  );
}
