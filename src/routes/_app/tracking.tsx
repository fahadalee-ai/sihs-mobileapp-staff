import { createFileRoute } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/Chrome";
import { TRACKING_COPY } from "@/lib/staff-data";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app/tracking")({
  head: () => ({ meta: [{ title: "SIH&S — Tracking" }] }),
  component: Tracking,
});

function Tracking() {
  const { tracking } = useStaff();
  const label = tracking === "on" ? "On — active assignment" : tracking === "interrupted" ? "Interrupted" : "Off — no active assignment";
  return (
    <div>
      <ScreenHeader title="Tracking and Privacy" backTo="/profile" />
      <div className="space-y-3 px-4 pb-8 text-sm">
        <p>{TRACKING_COPY}</p>
        <p className="font-semibold">Current tracking status: {label}</p>
        <p>Tracking is limited to active SIH&S work. It is not used outside an assignment.</p>
      </div>
    </div>
  );
}
