import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ClipboardList, Home, Phone, ShieldAlert, User, Briefcase } from "lucide-react";
import type { ReactNode } from "react";
import { LEGAL_LINKS, PHONE_DISPLAY, PHONE_TEL, type LegalId } from "@/lib/content";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/log", label: "Daily Log", icon: ClipboardList },
  { to: "/report", label: "Report", icon: ShieldAlert },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Primary"
      className="z-40 grid shrink-0 grid-cols-5 border-t border-[#4eae34] bg-[#5fbb3f] pb-[max(0.25rem,env(safe-area-inset-bottom))] text-[#001e16]"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.to;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            aria-current={active ? "page" : undefined}
            className="flex min-h-14 flex-col items-center justify-center gap-0.5 px-0.5 text-center text-[10px] font-semibold leading-tight text-[#001e16]"
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                active ? "bg-[#001e16] text-[#5fbb3f]" : "text-[#001e16]/75",
              )}
            >
              <Icon size={20} aria-hidden />
            </span>
            <span className={active ? "text-[#001e16]" : "text-[#001e16]/70"}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

const BACK_LABEL: Record<string, string> = {
  "/jobs": "Jobs",
  "/home": "Home",
  "/profile": "Profile",
  "/report": "Report",
  "/login": "Sign In",
};

function BackLink({ to, label }: { to: string; label: string }) {
  const className = "relative z-10 flex h-11 max-w-[40%] items-center gap-0.5 pl-1 pr-2 text-[17px] font-normal text-[#8fd86f]";
  const content = (
    <>
      <ChevronLeft size={28} strokeWidth={2.25} aria-hidden />
      <span className="truncate">{label}</span>
    </>
  );
  if (to === "/jobs") return <Link to="/jobs" aria-label={`Back to ${label}`} className={className}>{content}</Link>;
  if (to === "/home") return <Link to="/home" aria-label={`Back to ${label}`} className={className}>{content}</Link>;
  if (to === "/profile") return <Link to="/profile" aria-label={`Back to ${label}`} className={className}>{content}</Link>;
  if (to === "/report") return <Link to="/report" aria-label={`Back to ${label}`} className={className}>{content}</Link>;
  if (to === "/login") return <Link to="/login" aria-label={`Back to ${label}`} className={className}>{content}</Link>;
  return <a href={to} aria-label={`Back to ${label}`} className={className}>{content}</a>;
}

export function ScreenHeader({
  title,
  backTo = "/home",
  backLabel,
  dark,
  menu,
}: {
  title: string;
  backTo?: string;
  backLabel?: string;
  dark?: boolean;
  menu?: ReactNode;
}) {
  const label = backLabel ?? BACK_LABEL[backTo] ?? "Back";
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-white/10 bg-[#001e16] px-2 pt-[max(1rem,env(safe-area-inset-top))] pb-4",
        dark ? "text-white" : "text-[#f4f7f5]",
      )}
    >
      <div className="relative flex h-11 items-center py-1">
        <BackLink to={backTo} label={label} />
        <h1 className="pointer-events-none absolute inset-x-16 truncate text-center text-[17px] font-semibold">{title}</h1>
        <div className="relative z-10 ml-auto flex h-11 w-11 items-center justify-center">{menu}</div>
      </div>
    </header>
  );
}

export function CallHook({ dark }: { dark?: boolean }) {
  return (
    <a
      href={`tel:${PHONE_TEL}`}
      className={cn(
        "flex min-h-11 items-center justify-center gap-2 text-sm font-semibold underline-offset-2 hover:underline",
        dark ? "text-[#8fd86f]" : "text-accent-text",
      )}
    >
      <Phone size={18} aria-hidden />
      {PHONE_DISPLAY}
    </a>
  );
}

export function LegalLinks({ dark }: { dark?: boolean }) {
  return (
    <ul className={cn("space-y-2 text-sm", dark ? "text-[#c5d4cc]" : "text-foreground")}>
      {LEGAL_LINKS.map((link) => (
        <li key={link.id}>
          <Link
            to="/legal/$doc"
            params={{ doc: link.id }}
            className="inline-flex min-h-11 items-center underline underline-offset-2"
          >
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Toasts() {
  const { toasts, dismissToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 mx-auto flex w-full max-w-[480px] flex-col gap-2 px-4">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          className="pointer-events-auto rounded-md bg-[#5fbb3f] px-4 py-3 text-left text-sm text-[#001e16] shadow"
        >
          <span className="font-semibold">{t.title}</span>
          {t.body && <span className="mt-0.5 block text-[#001e16]/80">{t.body}</span>}
        </button>
      ))}
    </div>
  );
}

export function isLegalId(value: string): value is LegalId {
  return LEGAL_LINKS.some((l) => l.id === value);
}
