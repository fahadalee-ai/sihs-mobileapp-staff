import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/kit";
import { FUNCTIONS, TRACKING_COPY, functionTitle } from "@/lib/staff-data";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/setup")({
  head: () => ({ meta: [{ title: "SIH&S — You're approved" }] }),
  component: Setup,
});

function Setup() {
  const { user, completeSetup, setTracking, setBiometric } = useStaff();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [bio, setBio] = useState(false);

  if (!user) {
    return (
      <div className="theme-dark min-h-dvh bg-brand px-5 py-10 text-white">
        <p>Sign in with an approved staff account.</p>
      </div>
    );
  }

  const requested = user.requestedRoles.filter((code) => !user.approvedRoles.includes(code));

  return (
    <div className="theme-dark min-h-dvh bg-brand px-5 pb-8 pt-[max(1.5rem,env(safe-area-inset-top))] text-white">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#c5d4cc]">Step {step + 1} of 3</p>
      {step === 0 && (
        <>
          <h1 className="mt-3 text-2xl font-semibold">You're approved.</h1>
          <p className="mt-2 text-sm text-[#c5d4cc]">{user.organization}</p>
          <p className="text-sm text-[#c5d4cc]">Assigned supervisor: {user.supervisor}</p>
          <h2 className="mb-2 mt-4 text-sm font-semibold uppercase tracking-wide">Approved roles</h2>
          <ul className="flex flex-wrap gap-2">
            {user.approvedRoles.map((code) => (
              <li key={code} className="rounded-md bg-[#5fbb3f] px-2 py-1 text-xs font-semibold text-[#001e16]">
                {functionTitle(code)}
              </li>
            ))}
          </ul>
          {requested.length > 0 && (
            <div className="mt-4 rounded-md border border-white/15 p-3 text-sm">
              <p className="font-semibold">Requested vs Approved</p>
              <p className="mt-1">Requested: {user.requestedRoles.map(functionTitle).join(", ")}</p>
              <p>Approved: {user.approvedRoles.map(functionTitle).join(", ")}</p>
              <p className="mt-2 text-[#c5d4cc]">The app uses approved roles only.</p>
            </div>
          )}
          <Button type="button" full className="mt-6" onClick={() => setStep(1)}>
            Continue
          </Button>
        </>
      )}
      {step === 1 && (
        <>
          <h1 className="mt-3 text-2xl font-semibold">Permissions</h1>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-md border border-white/15 p-3">
              <p className="font-semibold">Location — Always allow</p>
              <p className="mt-1 text-[#c5d4cc]">{TRACKING_COPY}</p>
              <div className="mt-3 flex gap-2">
                <Button type="button" onClick={() => setTracking("on")}>Allow</Button>
                <Button type="button" variant="outline" onClick={() => setTracking("off")}>Not now</Button>
              </div>
              <p className="mt-2 text-xs text-[#c5d4cc]">Active assignments require location sharing. Choosing Not now leaves tracking off until you allow it.</p>
            </li>
            <li className="rounded-md border border-white/15 p-3">
              <p className="font-semibold">Camera</p>
              <p className="mt-1 text-[#c5d4cc]">Used for fresh in-app job photos. Gallery photos are not accepted on property work.</p>
            </li>
            <li className="rounded-md border border-white/15 p-3">
              <p className="font-semibold">Notifications</p>
              <p className="mt-1 text-[#c5d4cc]">Assignment, approval, and sync messages. They do not include medical or claim details.</p>
            </li>
          </ul>
          <Button type="button" full className="mt-6" onClick={() => setStep(2)}>Continue</Button>
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="mt-3 text-2xl font-semibold">Security</h1>
          <p className="mt-2 text-sm text-[#c5d4cc]">Optional biometric unlock on this device. Administrators use a separate extra sign-in when SIH&S enables it.</p>
          <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={bio}
              onChange={(e) => {
                setBio(e.target.checked);
                setBiometric(e.target.checked);
              }}
            />
            <span>Use biometric unlock</span>
          </label>
          <p className="mt-4 text-xs text-[#c5d4cc]">Approved functions on this account: {FUNCTIONS.filter((item) => user.approvedRoles.includes(item.code)).map((item) => item.title).join(", ")}</p>
          <Button
            type="button"
            full
            className="mt-6"
            onClick={() => {
              completeSetup();
              navigate({ to: "/home" });
            }}
          >
            Continue to Home
          </Button>
        </>
      )}
    </div>
  );
}
