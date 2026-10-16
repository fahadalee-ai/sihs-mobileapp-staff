import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ScreenHeader } from "@/components/Chrome";
import { Button, Field, Input } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "SIH&S — Verify email" }] }),
  component: Verify,
});

function Verify() {
  const { pendingEmail, verifyCode, verifyEmail } = useApp();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (!pendingEmail) navigate({ to: "/signup" });
  }, [pendingEmail, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [seconds]);

  return (
    <div className="theme-dark min-h-dvh bg-brand text-white">
      <ScreenHeader title="Verify Email" backTo="/signup" dark />
      <form
        className="px-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!verifyEmail(code)) {
            setError("Enter the 6-digit code.");
            return;
          }
          navigate({ to: "/ready" });
        }}
      >
        <p className="mb-4 text-sm text-[#c5d4cc]">Enter the 6-digit code sent to {pendingEmail}.</p>
        {verifyCode && (
          <p className="mb-4 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm">
            Prototype code: <span className="font-semibold">{verifyCode}</span>
          </p>
        )}
        <Field label="Verification code" error={error || undefined}>
          <Input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
          />
        </Field>
        <Button type="submit" full disabled={code.length !== 6}>
          Verify
        </Button>
        <button
          type="button"
          disabled={seconds > 0}
          onClick={() => setSeconds(30)}
          className="mt-4 min-h-11 text-sm font-semibold text-[#8fd86f] disabled:text-[#c5d4cc]"
        >
          {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
        </button>
      </form>
    </div>
  );
}
