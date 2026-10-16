import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CallHook } from "@/components/Chrome";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/pending")({
  head: () => ({ meta: [{ title: "SIH&S — Account pending" }] }),
  component: PendingAccount,
});

function PendingAccount() {
  const { user, logout, approveAccount } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  const goHome = () => {
    approveAccount();
    navigate({ to: "/home" });
  };

  return (
    <div className="theme-dark flex min-h-dvh flex-col bg-[#001e16] px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold">Account pending SIH&S approval</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#c5d4cc]">
        {user?.fullName ? `${user.fullName}, your` : "Your"} account is created. SIH&S reviews the request before the home screen opens.
      </p>
      <div className="mt-6">
        <CallHook dark />
      </div>
      <button type="button" onClick={logout} className="mt-8 min-h-11 text-left text-sm font-semibold text-[#8fd86f]">
        Sign out
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6" role="dialog" aria-modal="true" aria-labelledby="approved-title">
          <div className="w-full max-w-sm rounded-[16px] border border-white/15 bg-[#06281f] p-5 text-white">
            <h2 id="approved-title" className="text-xl font-semibold">Admin approved your request</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#c5d4cc]">Admin approved your request. You can go to the home screen now.</p>
            <button type="button" onClick={goHome} className="mt-5 min-h-11 w-full rounded-[12px] bg-[#5fbb3f] text-[16px] font-semibold text-[#001e16]">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
