import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { CallHook } from "@/components/Chrome";
import { Button } from "@/components/kit";
import { DEMO_USERS, type StaffUser } from "@/lib/staff-data";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "SIH&S — Staff Sign In" }] }),
  component: Login,
});

function destination(person: StaffUser) {
  if (person.status === "pending") return "/pending" as const;
  if (person.status === "more-info") return "/more-info" as const;
  if (person.status === "rejected") return "/rejected" as const;
  if (person.status === "suspended") return "/revoked" as const;
  if (!person.setupDone) return "/setup" as const;
  return "/home" as const;
}

const SAMPLES: [string, string, string][] = [
  ["st-dana", "Approved tow operator", "Open the staff home"],
  ["st-first", "Approved, first login", "See the welcome setup"],
  ["st-pending", "Pending approval", "Application still with SIH&S"],
  ["st-info", "More information needed", "Items to update"],
  ["st-no", "Rejected", "Application was not approved"],
  ["st-end", "Access ended", "No records are shown"],
];

function Login() {
  const { login, preview } = useStaff();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const open = (person: StaffUser) => {
    preview(person.id);
    navigate({ to: destination(person) });
  };

  return (
    <div className="theme-dark flex min-h-dvh flex-col bg-[#001e16] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.75rem,env(safe-area-inset-top))] text-white">
      <BrandLogo size="md" />
      <h1 className="mt-8 text-[28px] font-semibold leading-tight tracking-tight">Staff Sign In</h1>
      <p className="mt-2 max-w-[22rem] text-[15px] leading-snug text-[#c5d4cc]">Sign in with your SIH&S staff account.</p>

      <form
        className="mt-6 rounded-2xl border border-white/10 bg-[#06281f] p-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          login(email, password);
          const person = DEMO_USERS.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
          navigate({ to: person ? destination(person) : "/home" });
        }}
      >
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#f4f7f5]">Email</span>
          <span className="relative block">
            <Mail size={18} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fd86f]" />
            <input
              type="email"
              autoComplete="username"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="h-12 w-full rounded-xl border border-white/10 bg-[#0c3328] pl-11 pr-3 text-[15px] text-[#f4f7f5] outline-none placeholder:text-[#c5d4cc] focus:border-[#5fbb3f]"
            />
          </span>
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-medium text-[#f4f7f5]">Password</span>
          <span className="relative block">
            <Lock size={18} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fd86f]" />
            <input
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 w-full rounded-xl border border-white/10 bg-[#0c3328] pl-11 pr-12 text-[15px] text-[#f4f7f5] outline-none placeholder:text-[#c5d4cc] focus:border-[#5fbb3f]"
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#c5d4cc]"
              onClick={() => setShow((v) => !v)}
            >
              {show ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
            </button>
          </span>
        </label>

        <div className="mt-1 flex justify-end">
          <Link to="/forgot" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#8fd86f]">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" full>
          Sign in
        </Button>
      </form>

      <Link
        to="/apply"
        className="mt-3 flex min-h-12 items-center justify-between rounded-md border border-white/20 px-4 text-sm font-semibold"
      >
        New staff? Apply for access
        <ChevronRight size={18} aria-hidden />
      </Link>

      <section className="mt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">Sample accounts</h2>
        <p className="mt-1 text-xs leading-snug text-[#c5d4cc]">These open a design preview. They are not a live sign-in.</p>
        <ul className="mt-2 overflow-hidden rounded-md border border-white/15 bg-[#06281f]">
          {SAMPLES.map(([id, label, detail], index) => (
            <li key={id} className={index > 0 ? "border-t border-white/10" : undefined}>
              <button
                type="button"
                className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-left"
                onClick={() => {
                  const person = DEMO_USERS.find((item) => item.id === id);
                  if (person) open(person);
                }}
              >
                <span>
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs text-[#c5d4cc]">{detail}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-[#8fd86f]" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-auto pt-8">
        <CallHook dark />
      </div>
    </div>
  );
}
