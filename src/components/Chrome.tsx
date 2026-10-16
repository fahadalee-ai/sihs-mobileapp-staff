import { Link, useCanGoBack, useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Home, MapPin, Phone, User } from "lucide-react";
import type { ReactNode } from "react";
import { LEGAL_LINKS, PHONE_DISPLAY, PHONE_TEL, type LegalId } from "@/lib/content";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/bookings", label: "Requests", icon: Calendar },
  { to: "/location", label: "Service area", icon: MapPin },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-40 grid grid-cols-4 border-t border-[#4eae34] bg-[#5fbb3f] pb-[max(0.25rem,env(safe-area-inset-bottom))] text-[#001e16]"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.to;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            aria-current={active ? "page" : undefined}
            className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#001e16]"
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

export function ScreenHeader({
  title,
  backTo = "/home",
  dark,
  menu,
}: {
  title: string;
  backTo?: string;
  dark?: boolean;
  menu?: ReactNode;
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center gap-2 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-3",
        "bg-[#001e16]",
        dark ? "text-white" : "text-[#f4f7f5]",
      )}
    >
      <button
        type="button"
        aria-label="Go back"
        onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: backTo }))}
        className="flex h-11 w-11 items-center justify-center"
      >
        <ArrowLeft size={22} aria-hidden />
      </button>
      <h1 className="flex-1 truncate text-center text-base font-semibold">{title}</h1>
      <div className="flex h-11 w-11 items-center justify-center">{menu}</div>
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
