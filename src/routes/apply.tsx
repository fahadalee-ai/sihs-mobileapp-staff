import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Check, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useState, type ReactNode } from "react";
import { CallHook } from "@/components/Chrome";
import { Button, Field, Input } from "@/components/kit";
import { FUNCTIONS, TRACKING_COPY, functionTitle, type FunctionCode, type WorkerType } from "@/lib/staff-data";
import { SMS_CONSENT, formatPhone } from "@/lib/content";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/apply")({
  head: () => ({ meta: [{ title: "SIH&S — Join staff" }] }),
  component: Apply,
});

const TYPES: { id: WorkerType; title: string; body: string }[] = [
  { id: "employee", title: "SIH&S Employee", body: "Direct SIH&S staff." },
  { id: "worker", title: "Subcontractor Worker", body: "Works for an external company on SIH&S assignments." },
  { id: "supervisor", title: "Subcontractor Supervisor", body: "Leads a subcontractor crew and sees crew-level views." },
];

const STEP_LABELS = ["Account", "Worker type", "Job functions", "Qualifications", "Disclosures"];

function Apply() {
  const { submitApplication } = useStaff();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);
  const [sms, setSms] = useState(false);
  const [workerType, setWorkerType] = useState<WorkerType | "">("");
  const [companyName, setCompanyName] = useState("");
  const [companyContact, setCompanyContact] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [employeeRef, setEmployeeRef] = useState("");
  const [roles, setRoles] = useState<FunctionCode[]>([]);
  const [docs, setDocs] = useState<string[]>([]);
  const [trackOk, setTrackOk] = useState(false);
  const [error, setError] = useState("");

  const toggleRole = (code: FunctionCode) => {
    setRoles((current) => (current.includes(code) ? current.filter((item) => item !== code) : [...current, code]));
  };

  const next = () => {
    setError("");
    if (step === 0) {
      if (!fullName.trim() || !email.includes("@") || phone.replace(/\D/g, "").length !== 10) {
        setError("Enter your name, a work email, and a 10-digit mobile phone.");
        return;
      }
      if (password.length < 8 || !/\d/.test(password)) {
        setError("Use at least 8 characters, including a number.");
        return;
      }
      if (password !== confirm) {
        setError("Password and confirmation do not match.");
        return;
      }
      if (!terms || !sms) {
        setError("Accept the terms and the SMS consent to continue.");
        return;
      }
    }
    if (step === 1 && !workerType) {
      setError("Choose one worker type.");
      return;
    }
    if (step === 2 && roles.length === 0) {
      setError("Select at least one job function. SIH&S still confirms what you are approved for.");
      return;
    }
    if (step === 4 && !trackOk) {
      setError("Acknowledge the location tracking disclosure.");
      return;
    }
    if (step === 4) {
      submitApplication({
        fullName,
        email,
        phone,
        password,
        workerType: workerType || "employee",
        companyName,
        companyContact,
        companyPhone,
        supervisorName,
        employeeRef,
        requestedRoles: roles,
      });
      setDone(true);
      return;
    }
    setStep((value) => value + 1);
  };

  if (done) {
    return (
      <div className="theme-dark flex min-h-dvh flex-col bg-[#001e16] px-5 pb-8 pt-[max(1.75rem,env(safe-area-inset-top))] text-white">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8fd86f]">Application received</p>
        <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight">Pending SIH&S approval</h1>
        <p className="mt-3 text-sm leading-snug text-[#c5d4cc]">Requested roles do not grant access. Jobs and records stay closed until SIH&S approves the account.</p>
        <ol className="mt-5 space-y-2">
          {[
            "SIH&S reviews your application.",
            "You may be asked for more information.",
            "You are notified when the account is approved.",
          ].map((line, index) => (
            <li key={line} className="flex gap-3 rounded-md bg-[#06281f] p-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5fbb3f] text-xs font-bold text-[#001e16]">{index + 1}</span>
              <span className="pt-0.5">{line}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <CallHook dark />
        </div>
        <Button type="button" full className="mt-4" onClick={() => navigate({ to: "/login" })}>
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="theme-dark flex min-h-dvh flex-col bg-[#001e16] text-white">
      <header className="sticky top-0 z-30 flex items-center gap-2 bg-[#001e16] px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-3">
        <button
          type="button"
          className="flex h-11 shrink-0 items-center gap-1 rounded-md border border-white/40 bg-[#0c3328] px-3 text-sm font-semibold"
          onClick={() => (step === 0 ? navigate({ to: "/login" }) : setStep((value) => value - 1))}
        >
          <ArrowLeft size={18} aria-hidden />
          Back
        </button>
        <h1 className="min-w-0 flex-1 truncate text-center text-base font-semibold">Join SIH&S Staff</h1>
        <span className="w-11 text-right text-xs font-semibold text-[#c5d4cc]">{step + 1}/5</span>
      </header>

      <div className="px-5 pb-8">
        <ol className="flex gap-1" aria-label="Registration progress">
          {STEP_LABELS.map((label, index) => (
            <li key={label} className="flex-1">
              <span className={`block h-1 rounded-full ${index <= step ? "bg-[#5fbb3f]" : "bg-white/15"}`} />
              <span className="sr-only">{label}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm font-semibold">{STEP_LABELS[step]}</p>

        {error && (
          <p className="mt-3 flex items-start gap-2 rounded-md bg-[#0c3328] p-3 text-sm" role="alert">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#8fd86f]" aria-hidden />
            <span>{error}</span>
          </p>
        )}

        <div className="mt-4">
          {step === 0 && (
            <div className="space-y-4 rounded-2xl border border-white/10 bg-[#06281f] p-5">
              <AccountField label="Full name" icon={<User size={18} aria-hidden />}>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  placeholder="First and last name"
                  className={accountInput}
                />
              </AccountField>
              <AccountField label="Work email" icon={<Mail size={18} aria-hidden />}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@company.com"
                  className={accountInput}
                />
              </AccountField>
              <AccountField label="Mobile phone" icon={<Phone size={18} aria-hidden />}>
                <input
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(302) 555-0100"
                  className={accountInput}
                />
              </AccountField>
              <AccountField label="Password" hint="At least 8 characters, including a number." icon={<Lock size={18} aria-hidden />}>
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className={`${accountInput} pr-12`}
                />
                <ShowPassword show={show} onToggle={() => setShow((value) => !value)} />
              </AccountField>
              <AccountField label="Confirm password" icon={<Lock size={18} aria-hidden />}>
                <input
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className={`${accountInput} pr-12`}
                />
                <ShowPassword show={show} onToggle={() => setShow((value) => !value)} />
              </AccountField>
              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0c3328] p-3.5 text-sm leading-snug">
                <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#5fbb3f]" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                <span>
                  I accept the{" "}
                  <Link to="/legal/$doc" params={{ doc: "terms" }} className="font-semibold text-[#8fd86f] underline">
                    Full Terms & Agreement
                  </Link>
                  .
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0c3328] p-3.5 text-sm leading-snug">
                <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#5fbb3f]" checked={sms} onChange={(e) => setSms(e.target.checked)} />
                <span>
                  {SMS_CONSENT}{" "}
                  <Link to="/legal/$doc" params={{ doc: "privacy" }} className="font-semibold text-[#8fd86f] underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>
          )}

          {step === 1 && (
            <>
              <p className="mb-3 text-sm text-[#c5d4cc]">Choose one. This is a request. SIH&S confirms it.</p>
              <div className="space-y-2">
                {TYPES.map((item) => {
                  const selected = workerType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setWorkerType(item.id)}
                      className={`flex min-h-11 w-full items-start justify-between gap-3 rounded-md border px-3 py-3 text-left ${selected ? "border-[#5fbb3f] bg-[#0c3328]" : "border-white/15 bg-[#06281f]"}`}
                    >
                      <span>
                        <span className="block font-semibold">{item.title}</span>
                        <span className="mt-1 block text-sm text-[#c5d4cc]">{item.body}</span>
                      </span>
                      {selected && <Check size={18} className="mt-0.5 shrink-0 text-[#5fbb3f]" aria-hidden />}
                    </button>
                  );
                })}
              </div>
              {(workerType === "worker" || workerType === "supervisor") && (
                <div className="mt-4">
                  <Field label="Company Name">
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  </Field>
                  <Field label="Company Contact Name">
                    <Input value={companyContact} onChange={(e) => setCompanyContact(e.target.value)} />
                  </Field>
                  <Field label="Company Phone">
                    <Input value={companyPhone} onChange={(e) => setCompanyPhone(formatPhone(e.target.value))} inputMode="tel" />
                  </Field>
                  {workerType === "worker" && (
                    <Field label="Supervisor name">
                      <Input value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} />
                    </Field>
                  )}
                </div>
              )}
              {workerType === "employee" && (
                <div className="mt-4">
                  <Field label="Employee ID or hiring manager name" hint="Optional. It helps SIH&S match your application.">
                    <Input value={employeeRef} onChange={(e) => setEmployeeRef(e.target.value)} />
                  </Field>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <p className="mb-3 text-sm leading-snug text-[#c5d4cc]">Select the work you are qualified to perform. SIH&S will confirm which roles you are approved for.</p>
              <ul className="space-y-2">
                {FUNCTIONS.map((item) => {
                  const on = roles.includes(item.code);
                  return (
                    <li key={item.code}>
                      <button
                        type="button"
                        onClick={() => toggleRole(item.code)}
                        className={`flex min-h-11 w-full items-start gap-3 rounded-md border px-3 py-3 text-left ${on ? "border-[#5fbb3f] bg-[#0c3328]" : "border-white/15 bg-[#06281f]"}`}
                        aria-pressed={on}
                      >
                        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${on ? "bg-[#5fbb3f] text-[#001e16]" : "bg-[#0c3328] text-[#8fd86f]"}`}>
                          {on ? <Check size={14} aria-hidden /> : item.code.slice(0, 1)}
                        </span>
                        <span>
                          <span className="block font-semibold">{item.title}</span>
                          <span className="mt-1 block text-sm text-[#c5d4cc]">{item.blurb}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {step === 3 && (
            <>
              <p className="mb-3 text-sm leading-snug text-[#c5d4cc]">Uploads are requests for verification. They are not approved credentials.</p>
              {roles.length === 0 && <p className="text-sm">Go back and select a job function.</p>}
              {roles.map((code) => (
                <QualificationBlock key={code} code={code} onUpload={(name) => setDocs((list) => [...list, `${functionTitle(code)}: ${name}`])} />
              ))}
              {docs.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {docs.map((item) => (
                    <li key={item} className="rounded-md bg-[#06281f] px-3 py-3 text-sm">
                      {item}
                      <span className="mt-1 block text-xs font-semibold text-[#8fd86f]">Submitted—pending SIH&S verification</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs leading-snug text-[#c5d4cc]">Do not enter a Social Security number or other government ID number.</p>
            </>
          )}

          {step === 4 && (
            <>
              <article className="rounded-md bg-[#06281f] p-3 text-sm">
                <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">Review</h2>
                <p className="mt-2 font-semibold">{fullName || "Name missing"}</p>
                <p className="text-[#c5d4cc]">{email}</p>
                <p className="mt-2">{TYPES.find((item) => item.id === workerType)?.title ?? "Worker type not chosen"}</p>
                <p className="mt-1 text-[#c5d4cc]">{roles.map((code) => functionTitle(code)).join(", ") || "No roles requested"}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    ["Account", 0],
                    ["Type", 1],
                    ["Roles", 2],
                  ].map(([label, index]) => (
                    <button
                      key={label}
                      type="button"
                      className="min-h-11 rounded-md border border-white/15 text-sm font-semibold"
                      onClick={() => setStep(Number(index))}
                    >
                      Edit {label}
                    </button>
                  ))}
                </div>
              </article>
              <label className="mt-3 flex items-start gap-3 rounded-md bg-[#06281f] p-3 text-sm">
                <input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={trackOk} onChange={(e) => setTrackOk(e.target.checked)} />
                <span>{TRACKING_COPY}</span>
              </label>
            </>
          )}
        </div>

        <Button type="button" full className="mt-5" disabled={step === 0 && (!terms || !sms)} onClick={next}>
          {step === 4 ? "Submit for Approval" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

const accountInput =
  "h-12 w-full rounded-xl border border-white/10 bg-[#0c3328] pl-11 pr-3 text-[15px] text-[#f4f7f5] outline-none placeholder:text-[#c5d4cc] focus:border-[#5fbb3f]";

function AccountField({
  label,
  hint,
  icon,
  children,
}: {
  label: string;
  hint?: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#f4f7f5]">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fd86f]">{icon}</span>
        {children}
      </span>
      {hint && <span className="mt-1.5 block text-xs leading-snug text-[#c5d4cc]">{hint}</span>}
    </label>
  );
}

function ShowPassword({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={show ? "Hide password" : "Show password"}
      className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#c5d4cc]"
      onClick={onToggle}
    >
      {show ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
    </button>
  );
}

function QualificationBlock({ code, onUpload }: { code: FunctionCode; onUpload: (name: string) => void }) {
  const prompts: Record<FunctionCode, string[]> = {
    TOW: ["Driver's license class", "Towing equipment type", "Truck ID or unit number", "Insurance document"],
    COL: ["Collector certification date", "Collector training document", "DOT collector training, if applicable"],
    DNA: ["Collector training document"],
    NOT: ["Delaware notary commission document", "Expiration date"],
    LAW: ["Equipment list", "Relevant training, optional"],
    CUR: ["Vehicle type", "Driver's license"],
    XPT: ["Driver's license", "Vehicle type", "Insurance document"],
    PIM: ["Training or experience summary"],
    OFC: [],
  };
  const fields = prompts[code];
  if (!fields.length) {
    return <p className="mb-3 rounded-md bg-[#06281f] p-3 text-sm">Office support does not require a qualification upload.</p>;
  }
  return (
    <section className="mb-3 rounded-md bg-[#06281f] p-3">
      <h2 className="font-semibold">{functionTitle(code)}</h2>
      <ul className="mt-2 space-y-1 text-sm text-[#c5d4cc]">
        {fields.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
      {code !== "PIM" ? (
        <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-[#5fbb3f] px-3 text-sm font-semibold text-[#001e16]">
          Upload photo or PDF
          <input
            type="file"
            accept="image/*,.pdf"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file.name);
            }}
          />
        </label>
      ) : (
        <Field label="Training or experience summary">
          <Input onBlur={(e) => e.target.value && onUpload(e.target.value)} />
        </Field>
      )}
    </section>
  );
}
