import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CallHook, ScreenHeader } from "@/components/Chrome";
import { Button, Field, Input } from "@/components/kit";
import { SMS_CONSENT, formatPhone } from "@/lib/content";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "SIH&S — Sign up" }] }),
  component: SignUp,
});

function SignUp() {
  const { beginSignup, continueAsGuest } = useApp();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [terms, setTerms] = useState(false);
  const [sms, setSms] = useState(false);

  return (
    <div className="theme-dark min-h-dvh bg-brand text-white">
      <ScreenHeader title="Sign Up" backTo="/login" dark />
      <form
        className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const result = beginSignup({
            fullName: fullName.trim() || "SIH&S Customer",
            email: email.trim() || `customer${Date.now()}@sihs.local`,
            phone: phone.trim() || "(302) 000-0000",
            password: password || "password",
            address,
            smsAccepted: sms,
          });
          if (!result.ok) {
            continueAsGuest();
            navigate({ to: "/home" });
            return;
          }
          navigate({ to: "/pending" });
        }}
      >
        <Field label="Full Name">
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Susan Hooks" autoComplete="name" />
        </Field>
        <Field label="Email">
          <Input type="text" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" autoComplete="email" />
        </Field>
        <Field label="Phone Number">
          <Input
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="(302) 481-4656"
          />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="Create a password" />
        </Field>
        <Field label="Address (optional)">
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Wilmington, DE" autoComplete="street-address" />
        </Field>

        <label className="mb-3 flex min-h-11 items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 h-5 w-5" />
          <span>
            I accept the{" "}
            <Link to="/legal/$doc" params={{ doc: "terms" }} className="font-semibold text-[#8fd86f] underline">
              Full Terms & Agreement
            </Link>
            .
          </span>
        </label>
        <label className="mb-4 flex min-h-11 items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} className="mt-1 h-5 w-5" />
          <span>
            {SMS_CONSENT}{" "}
            <Link to="/legal/$doc" params={{ doc: "privacy" }} className="font-semibold text-[#8fd86f] underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        <Button type="submit" full>
          Sign Up
        </Button>
        <div className="mt-6">
          <CallHook dark />
        </div>
      </form>
    </div>
  );
}
