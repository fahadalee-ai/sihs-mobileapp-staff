import { createFileRoute, useNavigate, type UseNavigateResult } from "@tanstack/react-router";
import {
  AlertCircle,
  Bell,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Cloud,
  MapPin,
  Phone,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { PHONE_DISPLAY, PHONE_TEL, greeting } from "@/lib/content";
import { functionTitle, type FunctionCode, type Job } from "@/lib/staff-data";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app/home")({
  head: () => ({ meta: [{ title: "SIH&S — Home" }] }),
  component: Home,
});

const SHORT_ROLE: Record<FunctionCode, string> = {
  TOW: "Tow Operator",
  XPT: "Transport Driver",
  COL: "Collector",
  DNA: "DNA Collector",
  NOT: "Notary",
  LAW: "Property Crew",
  CUR: "Courier",
  PIM: "PIM-VEE™",
  OFC: "Office Support",
};

const ACTIONS: Record<string, { label: string; href: string }[]> = {
  TOW: [
    { label: "Start Roadside Job", href: "/field/SIHS-J-220184" },
    { label: "Vehicle Condition Capture", href: "/field/SIHS-J-220184" },
    { label: "Report Hazard", href: "/field/SIHS-J-220184" },
  ],
  XPT: [
    { label: "Start Transport Trip", href: "/field/SIHS-J-440771" },
    { label: "Passenger Check", href: "/service/SIHS-J-440771" },
    { label: "Report Delay", href: "/report" },
  ],
  COL: [
    { label: "Start Collection", href: "/field/SIHS-J-551063" },
    { label: "Open Authorization", href: "/service/SIHS-J-551063" },
    { label: "Specimen Transfer", href: "/service/SIHS-J-551063" },
  ],
  DNA: [
    { label: "Start DNA Collection", href: "/field/SIHS-J-660214" },
    { label: "Open Consent", href: "/service/SIHS-J-660214" },
    { label: "Specimen Transfer", href: "/service/SIHS-J-660214" },
  ],
  NOT: [
    { label: "Start Appointment", href: "/field/SIHS-J-770331" },
    { label: "Open Notary Journal", href: "/service/SIHS-J-770331" },
  ],
  LAW: [
    { label: "Start Property Visit", href: "/field/SIHS-J-880442" },
    { label: "Open Area Checklist", href: "/service/SIHS-J-880442" },
    { label: "Flag Existing Damage", href: "/field/SIHS-J-880442" },
  ],
  CUR: [
    { label: "Start Delivery Run", href: "/field/SIHS-J-990118" },
    { label: "Scan or Enter Item ID", href: "/service/SIHS-J-990118" },
    { label: "Report Shortage", href: "/service/SIHS-J-990118" },
  ],
  PIM: [
    { label: "Start Documentation", href: "/field/SIHS-J-101055" },
    { label: "Add Statement", href: "/pim/SIHS-J-101055" },
    { label: "Add Camera Source", href: "/pim/SIHS-J-101055" },
  ],
  OFC: [{ label: "Add Log Entry", href: "/log" }],
};

function openPath(navigate: UseNavigateResult<string>, href: string) {
  const job = href.match(/^\/jobs\/(.+)$/);
  const field = href.match(/^\/field\/(.+)$/);
  const service = href.match(/^\/service\/(.+)$/);
  const pim = href.match(/^\/pim\/(.+)$/);
  if (job) navigate({ to: "/jobs/$id", params: { id: job[1] } });
  else if (field) navigate({ to: "/field/$id", params: { id: field[1] } });
  else if (service) navigate({ to: "/service/$id", params: { id: service[1] } });
  else if (pim) navigate({ to: "/pim/$id", params: { id: pim[1] } });
  else if (href === "/log") navigate({ to: "/log" });
  else if (href === "/report") navigate({ to: "/report" });
  else if (href === "/qualifications") navigate({ to: "/qualifications" });
}

function nextStep(job: Job) {
  const needsAck =
    job.latestLabel === "Unacknowledged assignment" ||
    job.missing.some((item) => item.toLowerCase().includes("acknowledge"));
  if (needsAck) return { label: "Acknowledge assignment", href: `/jobs/${job.id}` };
  if (job.status === "Checked out—documentation incomplete") {
    return { label: "Finish missing documentation", href: `/field/${job.id}` };
  }
  if (job.status === "In Progress") return { label: "Update status", href: `/field/${job.id}` };
  if (job.status === "Needs Attention") return { label: "Review this job", href: `/jobs/${job.id}` };
  return { label: "Open job", href: `/jobs/${job.id}` };
}

function Home() {
  const { user, jobs, sync, qualifications, notices, showAllJobs, setShowAllJobs, setRole, tracking, setTracking } = useStaff();
  const navigate = useNavigate();
  const [rolesOpen, setRolesOpen] = useState(false);
  const role = user?.activeRole ?? "TOW";
  const first = user?.fullName.split(" ")[0] ?? "there";
  const visible = jobs.filter((job) => showAllJobs || job.functionCode === role);
  const current = visible.find((job) => job.status === "In Progress") ?? visible.find((job) => job.status !== "Completed");
  const later = visible.filter((job) => job.id !== current?.id).slice(0, 4);
  const saved = sync.filter((item) => item.status === "Saved locally").length;
  const uploading = sync.filter((item) => item.status === "Uploading").length;
  const failed = sync.filter((item) => item.status === "Upload failed — will retry").length;
  const waiting = saved + uploading + failed;
  const expired = qualifications.some((item) => item.status === "Expired");
  const actions = ACTIONS[role] ?? [];
  const step = current ? nextStep(current) : null;
  const sharing = tracking === "interrupted" ? "interrupted" : tracking === "on" || current?.status === "In Progress" ? "on" : "off";
  const unacked = visible.find((job) => job.latestLabel === "Unacknowledged assignment");
  const missingJob = visible.find((job) => job.missing.length > 0);
  const alerts = [
    expired && role === "COL"
      ? { id: "qual", text: "Collector training is expired. This function stays blocked until SIH&S verifies a replacement.", href: "/qualifications" }
      : null,
    unacked ? { id: "ack", text: `${unacked.id} is waiting for your acknowledgment.`, href: `/jobs/${unacked.id}` } : null,
    missingJob && missingJob.id !== unacked?.id
      ? { id: "docs", text: `${missingJob.id} is missing documentation.`, href: `/jobs/${missingJob.id}` }
      : null,
  ].filter((item): item is { id: string; text: string; href: string } => Boolean(item));

  return (
    <div className="px-4 pb-8 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[#c5d4cc]">{greeting()}</p>
          <h1 className="truncate text-[28px] font-semibold leading-tight tracking-tight">{first}</h1>
          <p className="mt-1 truncate text-sm text-[#c5d4cc]">{user?.organization}</p>
        </div>
        <button
          type="button"
          aria-label={`Notifications, ${notices.length} unread`}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/15 bg-[#06281f]"
          onClick={() => navigate({ to: "/notifications" })}
        >
          <Bell size={20} aria-hidden />
          {notices.length > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5fbb3f] px-1 text-[10px] font-bold text-[#001e16]">
              {notices.length}
            </span>
          )}
        </button>
      </header>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          className="flex min-h-11 min-w-0 flex-1 items-center justify-between gap-2 rounded-md bg-[#5fbb3f] px-3 text-left text-sm font-semibold text-[#001e16]"
          onClick={() => setRolesOpen(true)}
          aria-haspopup="dialog"
        >
          <span className="truncate">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-[#001e16]/70">Active role</span>
            {SHORT_ROLE[role]}
          </span>
          <ChevronDown size={18} aria-hidden />
        </button>
        <div className="flex h-11 shrink-0 rounded-md border border-white/15 p-0.5" role="group" aria-label="Job filter">
          <button
            type="button"
            aria-pressed={!showAllJobs}
            className={`min-h-10 rounded-md px-3 text-xs font-semibold ${showAllJobs ? "text-[#c5d4cc]" : "bg-[#0c3328] text-white"}`}
            onClick={() => setShowAllJobs(false)}
          >
            This role
          </button>
          <button
            type="button"
            aria-pressed={showAllJobs}
            className={`min-h-10 rounded-md px-3 text-xs font-semibold ${showAllJobs ? "bg-[#0c3328] text-white" : "text-[#c5d4cc]"}`}
            onClick={() => setShowAllJobs(true)}
          >
            All jobs
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="min-h-[72px] rounded-md bg-[#06281f] p-3 text-left"
          onClick={() => {
            if (sharing === "interrupted") navigate({ to: "/exceptions", search: { screen: "tracking" } });
          }}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">
            <MapPin size={14} aria-hidden />
            Location
          </span>
          <span className="mt-1 block text-sm font-semibold leading-snug">
            {sharing === "on" && "On — active assignment"}
            {sharing === "off" && "Off — no active assignment"}
            {sharing === "interrupted" && "Interrupted. Tap to fix."}
          </span>
          <span className="mt-1 block text-[11px] text-[#c5d4cc]">Source: Automatic</span>
        </button>
        <button type="button" className="min-h-[72px] rounded-md bg-[#06281f] p-3 text-left" onClick={() => navigate({ to: "/sync" })}>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">
            <Cloud size={14} aria-hidden />
            Sync
          </span>
          <span className="mt-1 block text-sm font-semibold leading-snug">
            {waiting === 0 ? "All received" : `${waiting} still on this phone`}
          </span>
          <span className="mt-1 block text-[11px] text-[#c5d4cc]">
            {failed > 0 ? `${failed} will retry` : "Saved locally, uploading, received"}
          </span>
        </button>
      </div>
      <button
        type="button"
        className="mt-2 min-h-11 text-xs font-semibold text-[#8fd86f]"
        onClick={() => setTracking(tracking === "interrupted" ? "on" : "interrupted")}
      >
        {tracking === "interrupted" ? "Show location sharing on" : "Preview interrupted location"}
      </button>

      {current && step && (
        <article className="mt-2 rounded-md border border-[#5fbb3f]/50 bg-[#06281f] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8fd86f]">Current assignment</p>
          <div className="mt-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold leading-tight">{current.service}</h2>
              <p className="mt-1 text-sm text-[#c5d4cc]">{current.id}</p>
            </div>
            <span className="shrink-0 rounded-md bg-[#5fbb3f] px-2 py-1 text-xs font-semibold text-[#001e16]">{current.status}</span>
          </div>
          <p className="mt-3 flex items-start gap-2 text-sm">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[#8fd86f]" aria-hidden />
            <span>{current.serviceLocation}</span>
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-[#c5d4cc]">
            <Clock size={16} aria-hidden />
            {current.when}
          </p>
          <p className="mt-2 text-xs text-[#c5d4cc]">Latest update: {current.latestLabel} · {current.latestSource}</p>
          <button
            type="button"
            className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#5fbb3f] px-4 text-sm font-semibold text-[#001e16]"
            onClick={() => openPath(navigate, step.href)}
          >
            {step.label}
            <ChevronRight size={18} aria-hidden />
          </button>
        </article>
      )}

      {alerts.length > 0 && (
        <section className="mt-4" aria-label="Alerts">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">Needs you</h2>
          <ul className="mt-2 space-y-2">
            {alerts.map((alert) => (
              <li key={alert.id}>
                <button
                  type="button"
                  className="flex min-h-11 w-full items-start gap-2 rounded-md bg-[#0c3328] p-3 text-left text-sm"
                  onClick={() => openPath(navigate, alert.href)}
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#8fd86f]" aria-hidden />
                  <span className="flex-1">{alert.text}</span>
                  <ChevronRight size={18} className="mt-0.5 shrink-0" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">Today</h2>
          <button type="button" className="min-h-11 text-sm font-semibold text-[#8fd86f]" onClick={() => navigate({ to: "/jobs" })}>
            All jobs
          </button>
        </div>
        {later.length === 0 ? (
          <p className="rounded-md bg-[#06281f] px-3 py-4 text-sm text-[#c5d4cc]">Nothing else is scheduled for this view.</p>
        ) : (
          <ul className="overflow-hidden rounded-md bg-[#06281f]">
            {later.map((job, index) => (
              <li key={job.id} className={index > 0 ? "border-t border-white/10" : undefined}>
                <button
                  type="button"
                  className="flex min-h-[4.5rem] w-full items-center gap-3 px-3 py-3 text-left"
                  onClick={() => navigate({ to: "/jobs/$id", params: { id: job.id } })}
                >
                  <span className="w-16 shrink-0 border-r border-white/10 pr-3 text-sm font-semibold leading-tight text-[#8fd86f]">
                    {job.when.replace(/^Today, |^Tomorrow, /, "")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{job.service}</span>
                    <span className="mt-0.5 block truncate text-xs text-[#c5d4cc]">{job.serviceLocation}</span>
                    <span className="mt-1 inline-flex rounded-md bg-[#0c3328] px-2 py-0.5 text-[11px] font-semibold">{job.status}</span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-[#c5d4cc]" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">Quick actions</h2>
        {actions[0] && (
          <button
            type="button"
            className="mt-2 flex min-h-12 w-full items-center justify-between rounded-md bg-[#5fbb3f] px-4 text-left text-sm font-semibold text-[#001e16]"
            onClick={() => openPath(navigate, actions[0].href)}
          >
            {actions[0].label}
            <ChevronRight size={18} aria-hidden />
          </button>
        )}
        {actions.length > 1 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {actions.slice(1).map((action) => (
              <button
                key={action.label}
                type="button"
                className="flex min-h-[4.5rem] flex-col items-start justify-between rounded-md bg-[#06281f] p-3 text-left"
                onClick={() => openPath(navigate, action.href)}
              >
                {action.label.toLowerCase().includes("hazard") || action.label.toLowerCase().includes("problem") || action.label.toLowerCase().includes("delay") || action.label.toLowerCase().includes("shortage") ? (
                  <AlertCircle size={16} className="text-[#8fd86f]" aria-hidden />
                ) : (
                  <Camera size={16} className="text-[#8fd86f]" aria-hidden />
                )}
                <span className="text-sm font-semibold leading-snug">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <RoleWidget role={role} />

      {user?.supervisorFlag && (
        <section className="mt-6">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">
            <Users size={14} aria-hidden />
            Crew
          </h2>
          <div className="mt-2 overflow-hidden rounded-md bg-[#06281f]">
            {(jobs.find((job) => job.crew)?.crew ?? []).map((member) => (
              <div key={member.name} className="flex min-h-11 items-center justify-between gap-3 border-b border-white/10 px-3">
                <span className="text-sm font-semibold">{member.name}</span>
                <span className="rounded-md bg-[#0c3328] px-2 py-1 text-[11px] font-semibold">{member.status}</span>
              </div>
            ))}
            {[
              ["Crew overview", "Who is assigned right now"],
              ["Substitute a member", "Ask dispatch to swap a person"],
              ["Review documentation", "What the crew has submitted"],
            ].map(([label, detail]) => (
              <button
                key={label}
                type="button"
                className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-white/10 px-3 py-2 text-left last:border-b-0"
                onClick={() => navigate({ to: "/jobs/$id", params: { id: "SIHS-J-220184" } })}
              >
                <span>
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs text-[#c5d4cc]">{detail}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-[#8fd86f]" aria-hidden />
              </button>
            ))}
          </div>
        </section>
      )}

      <a
        href={`tel:${PHONE_TEL}`}
        className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0c3328] px-3 text-sm font-semibold text-[#8fd86f]"
      >
        <Phone size={18} aria-hidden />
        Call SIH&S · {PHONE_DISPLAY}
      </a>

      {rolesOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="role-title">
          <div className="w-full max-w-[480px] rounded-t-[16px] bg-[#06281f] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <h2 id="role-title" className="text-xl font-semibold">Switch role</h2>
            <p className="mt-1 text-sm text-[#c5d4cc]">Only roles SIH&S has approved are listed. Home and quick actions follow the one you pick.</p>
            <ul className="mt-3 max-h-[50vh] space-y-1 overflow-y-auto">
              {(user?.approvedRoles ?? []).map((code) => {
                const selected = code === role;
                return (
                  <li key={code}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 text-left ${selected ? "bg-[#0c3328]" : ""}`}
                      onClick={() => {
                        setRole(code);
                        setRolesOpen(false);
                      }}
                    >
                      <span>
                        <span className="block font-semibold">{SHORT_ROLE[code]}</span>
                        <span className="block text-xs text-[#c5d4cc]">{functionTitle(code)}</span>
                      </span>
                      {selected && <Check size={18} className="shrink-0 text-[#5fbb3f]" aria-hidden />}
                    </button>
                  </li>
                );
              })}
            </ul>
            <button type="button" className="mt-3 min-h-11 w-full rounded-md border border-white/15 font-semibold" onClick={() => setRolesOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RoleWidget({ role }: { role: string }) {
  const card = "mt-6 rounded-md bg-[#06281f] p-3 text-sm";
  if (role === "TOW") {
    return (
      <section className={card}>
        <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">
          <Truck size={14} aria-hidden />
          Truck and equipment
        </h2>
        <p className="mt-2 text-base font-semibold">Unit 14</p>
        <ul className="mt-2 space-y-1">
          {[
            ["Wheel-lift", "Listed"],
            ["Flatbed", "Listed"],
            ["Dolly", "Not confirmed"],
          ].map(([name, state]) => (
            <li key={name} className="flex min-h-8 items-center justify-between gap-3">
              <span>{name}</span>
              <span className={`text-xs font-semibold ${state === "Listed" ? "text-[#8fd86f]" : "text-[#c5d4cc]"}`}>{state}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-[#c5d4cc]">Source: Employee-entered</p>
      </section>
    );
  }
  if (role === "XPT") {
    return (
      <section className={card}>
        <h2 className="font-semibold">Trip legs</h2>
        <ol className="mt-2 space-y-1">
          {["Pickup", "Testing-location arrival", "Return journey"].map((leg, index) => (
            <li key={leg} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0c3328] text-[11px] font-semibold">{index + 1}</span>
              {leg}
            </li>
          ))}
        </ol>
      </section>
    );
  }
  if (role === "COL" || role === "DNA") {
    return (
      <section className={card}>
        <h2 className="font-semibold">Collection milestones</h2>
        <p className="mt-1">Authorization, collection, then specimen transfer. Timing rules are set per program.</p>
      </section>
    );
  }
  if (role === "NOT") {
    return (
      <section className={card}>
        <h2 className="font-semibold">Journal access</h2>
        <p className="mt-1">The notary journal is separately protected and stays apart from the appointment record.</p>
      </section>
    );
  }
  if (role === "LAW") {
    return (
      <section className={card}>
        <h2 className="font-semibold">Before and after photos</h2>
        <p className="mt-1">Floor 2 restroom before photo is still missing.</p>
      </section>
    );
  }
  if (role === "CUR") {
    return (
      <section className={card}>
        <h2 className="font-semibold">Delivery run</h2>
        <p className="mt-1">Delivered is recorded. Customer accepted is still open.</p>
      </section>
    );
  }
  if (role === "PIM") {
    return (
      <section className={card}>
        <h2 className="font-semibold">Restricted workspace</h2>
        <p className="mt-1">PIM-VEE™ documentation stays factual. There are no fault or cause fields.</p>
      </section>
    );
  }
  return (
    <section className={card}>
      <h2 className="font-semibold">Today's duties</h2>
      <ul className="mt-2 space-y-1">
        {["Dispatch", "Office work", "Documentation"].map((duty) => (
          <li key={duty}>{duty}</li>
        ))}
      </ul>
    </section>
  );
}
