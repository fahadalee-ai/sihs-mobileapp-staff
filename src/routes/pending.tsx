import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CallHook } from "@/components/Chrome";
import { functionTitle } from "@/lib/staff-data";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/pending")({
  head: () => ({ meta: [{ title: "SIH&S — Pending approval" }] }),
  component: Pending,
});

function Pending() {
  const { user, logout } = useStaff();
  const navigate = useNavigate();
  return (
    <div className="theme-dark flex min-h-dvh flex-col bg-brand px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold">Your application is pending SIH&S approval.</h1>
      <p className="mt-3 text-sm text-[#c5d4cc]">Submitted {user?.submittedAt ?? "recently"}. Jobs and records stay closed.</p>
      <p className="mt-3 text-sm">Requested roles: {(user?.requestedRoles ?? []).map(functionTitle).join(", ") || "None on file"}</p>
      <p className="mt-2 text-sm text-[#c5d4cc]">These are requests only. Approved roles are assigned by SIH&S.</p>
      <div className="mt-6">
        <CallHook dark />
      </div>
      <button
        type="button"
        className="mt-6 min-h-11 text-left text-sm font-semibold text-[#8fd86f]"
        onClick={() => {
          logout();
          navigate({ to: "/login" });
        }}
      >
        Log out
      </button>
    </div>
  );
}
