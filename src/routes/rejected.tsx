import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CallHook } from "@/components/Chrome";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/rejected")({
  head: () => ({ meta: [{ title: "SIH&S — Application not approved" }] }),
  component: Rejected,
});

function Rejected() {
  const { user, logout } = useStaff();
  const navigate = useNavigate();
  return (
    <div className="theme-dark min-h-dvh bg-brand px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold">Your application was not approved.</h1>
      {user?.adminNote && <p className="mt-3 text-sm text-[#c5d4cc]">{user.adminNote}</p>}
      <div className="mt-6">
        <CallHook dark />
      </div>
      <button
        type="button"
        className="mt-6 min-h-11 text-sm font-semibold text-[#8fd86f]"
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
