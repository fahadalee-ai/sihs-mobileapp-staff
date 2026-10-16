import { createFileRoute } from "@tanstack/react-router";
import { CallHook, ScreenHeader } from "@/components/Chrome";

export const Route = createFileRoute("/forgot")({
  head: () => ({ meta: [{ title: "SIH&S — Forgot password" }] }),
  component: Forgot,
});

function Forgot() {
  return (
    <div className="theme-dark min-h-dvh bg-brand text-white">
      <ScreenHeader title="Forgot Password" backTo="/login" dark />
      <div className="px-5">
        <p className="text-sm leading-relaxed text-[#c5d4cc]">
          Password reset is not available in this version. Call SIH&S and the office can confirm the account.
        </p>
        <div className="mt-6">
          <CallHook dark />
        </div>
      </div>
    </div>
  );
}
