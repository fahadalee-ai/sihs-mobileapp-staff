import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import bgTow from "@/img/bg-onboard-tow.jpg";
import bgLab from "@/img/bg-onboard-lab.jpg";
import bgDelaware from "@/img/bg-onboard-delaware.jpg";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "SIH&S — Structured Incident Response" }] }),
  component: Onboarding,
});

const STEPS = [
  {
    photo: bgTow,
    focus: "center 42%",
    artLabel: "Dark green light-duty tow truck outside a service building",
    kicker: "Services",
    title: "Structured Incident Response",
    services: ["Delaware Intrastate Towing", "Regulated Collections", "DNA Services", "PIM-VEE™", "Notary"],
  },
  {
    photo: bgLab,
    focus: "center 35%",
    artLabel: "Specimen vials and a clipboard on a collection bench",
    kicker: "Collections",
    title: "Regulated. Documented. Accountable.",
    body: "Chain-of-custody collections, incident documentation, and notarial services performed to a documented standard.",
  },
  {
    photo: bgDelaware,
    focus: "center",
    artLabel: "Aerial view of Northern New Castle County along the Delaware River",
    kicker: "Service area",
    title: "Serving Northern New Castle County, Delaware",
    body: "Availability varies by service, staffing, location, and dispatch capacity. Delaware intrastate towing only; interstate moves coordinated through authorized carriers.",
    badge: "24/7",
  },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { markOnboarded } = useApp();
  const current = STEPS[step];
  const last = step === STEPS.length - 1;

  const finish = () => {
    markOnboarded();
    navigate({ to: "/login" });
  };

  return (
    <div className="theme-dark relative flex min-h-dvh flex-col overflow-hidden bg-[#001e16] text-white">
      <img
        key={current.photo}
        src={current.photo}
        alt={current.artLabel}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: current.focus }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,30,22,0.78)_0%,rgba(0,30,22,0.28)_34%,rgba(0,30,22,0.55)_58%,rgba(0,30,22,0.94)_78%,#001e16_100%)]" />

      <header className="relative z-10 flex items-center justify-between px-5 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <p className="text-[15px] font-semibold tracking-[0.16em] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">SIH&S</p>
        <button type="button" onClick={finish} className="min-h-11 px-1 text-[17px] font-semibold text-[#8fd86f]">
          Skip
        </button>
      </header>

      <div className="relative z-10 mt-auto flex flex-col px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-16">
        <div className="text-center">
          {current.badge && (
            <p className="mb-3 inline-flex rounded-full bg-[#5fbb3f] px-3 py-1 text-[13px] font-bold text-[#001e16]">
              {current.badge}
            </p>
          )}
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#8fd86f]">{current.kicker}</p>
          <h1 className="mx-auto mt-2 max-w-[22rem] text-[30px] font-bold leading-[1.15] tracking-tight text-white">
            {current.title}
          </h1>
          {current.services ? (
            <ul className="mx-auto mt-4 flex w-full max-w-[22rem] flex-wrap items-center justify-center gap-2">
              {current.services.map((item) => (
                <li key={item} className="rounded-full border border-white/30 bg-[#001e16]/35 px-3 py-1 text-[13px] text-white">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mx-auto mt-3 max-w-[22rem] text-[17px] leading-snug text-[#f4f7f5]">{current.body}</p>
          )}
        </div>

        <div className="mx-auto mt-6 flex items-center justify-center gap-1.5" aria-label="Onboarding progress">
          {STEPS.map((_, i) => (
            <span key={i} className="flex w-7 items-center justify-center">
              <span className={`h-2 rounded-full ${i === step ? "w-7 bg-[#5fbb3f]" : "w-2 bg-white/40"}`} />
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => (last ? finish() : setStep((s) => s + 1))}
          className="mt-5 flex min-h-[52px] w-full items-center justify-center rounded-[14px] bg-[#5fbb3f] text-[17px] font-semibold text-[#001e16] active:brightness-95"
        >
          {last ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
}
