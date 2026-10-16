import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CallHook } from "@/components/Chrome";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/revoked")({
  head: () => ({ meta: [{ title: "SIH&S — Access updated" }] }),
  component: Revoked,
});

function Revoked() {
  const { logout } = useApp();
  const navigate = useNavigate();
  return (
    <div className="theme-dark flex min-h-dvh flex-col bg-brand px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold">Your access to this organization has ended.</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#c5d4cc]">
        Contact SIH&S if you believe this is an error. Property and organization records are no longer shown.
      </p>
      <div className="mt-6">
        <CallHook dark />
      </div>
      <button
        type="button"
        className="mt-8 min-h-11 text-left text-sm font-semibold text-[#8fd86f]"
        onClick={() => {
          logout();
          navigate({ to: "/login" });
        }}
      >
        Return to sign in
      </button>
    </div>
  );
}
