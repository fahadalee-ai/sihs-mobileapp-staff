import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/Chrome";
import { Button, Field, Input } from "@/components/kit";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app/password")({
  head: () => ({ meta: [{ title: "SIH&S — Change password" }] }),
  component: ChangePassword,
});

function ChangePassword() {
  const { biometric, setBiometric, changePassword } = useStaff();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div>
      <ScreenHeader title="Security" backTo="/profile" />
      <form
        className="px-4 pb-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (next !== confirm) {
            setError("New password and confirmation do not match.");
            return;
          }
          const result = changePassword(current, next);
          if (!result.ok) {
            setError(result.reason);
            return;
          }
          setDone(true);
          setError("");
          setCurrent("");
          setNext("");
          setConfirm("");
        }}
      >
        <p className="mb-3 text-sm text-[#c5d4cc]">The saved password is never shown. Use at least 8 characters, including a number.</p>
        <Field label="Current Password" error={error || undefined}>
          <Input type={show ? "text" : "password"} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" aria-invalid={error ? true : undefined} />
        </Field>
        <Field label="New Password">
          <Input type={show ? "text" : "password"} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
        </Field>
        <Field label="Confirm New Password">
          <Input type={show ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </Field>
        <button type="button" className="mb-4 min-h-11 text-sm font-semibold underline" onClick={() => setShow((value) => !value)}>
          {show ? "Hide passwords" : "Show passwords"}
        </button>
        {done && <p className="mb-3 font-semibold text-[#8fd86f]" role="status">Password updated.</p>}
        <Button type="submit" full>Update password</Button>
      </form>
      <label className="flex min-h-11 items-center gap-3 px-4 text-sm">
        <input type="checkbox" checked={biometric} onChange={(e) => setBiometric(e.target.checked)} />
        Biometric unlock
      </label>
    </div>
  );
}
