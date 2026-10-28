import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CallHook } from "@/components/Chrome";

export const Route = createFileRoute("/session")({
  head: () => ({ meta: [{ title: "SIH&S — Session expired" }] }),
  component: SessionExpired,
});

function SessionExpired() {
  const navigate = useNavigate();
  return (
    <div className="theme-dark flex min-h-dvh flex-col bg-brand px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold">Session expired</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#c5d4cc]">
        Sign in again. Unsent items stay saved locally on this device. This screen does not show job or report details.
      </p>
      <div className="mt-6">
        <CallHook dark />
      </div>
      <button type="button" onClick={() => navigate({ to: "/login" })} className="mt-8 min-h-11 rounded-md bg-[#5fbb3f] px-4 font-semibold text-[#001e16]">
        Sign in
      </button>
    </div>
  );
}
