import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CallHook } from "@/components/Chrome";
import { Button } from "@/components/kit";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/more-info")({
  head: () => ({ meta: [{ title: "SIH&S — More information" }] }),
  component: MoreInfo,
});

function MoreInfo() {
  const { user, logout } = useStaff();
  const navigate = useNavigate();
  return (
    <div className="theme-dark min-h-dvh bg-brand px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold">More information needed</h1>
      <p className="mt-3 text-sm">{user?.adminNote || "SIH&S asked for an update to this application."}</p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[#c5d4cc]">
        <li>Current driver's license photo</li>
        <li>Company phone number</li>
      </ul>
      <Button type="button" full className="mt-6" onClick={() => navigate({ to: "/apply" })}>
        Update Application
      </Button>
      <div className="mt-4">
        <CallHook dark />
      </div>
      <button
        type="button"
        className="mt-4 min-h-11 text-sm font-semibold text-[#8fd86f]"
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
