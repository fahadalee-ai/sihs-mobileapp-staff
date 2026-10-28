import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, FileText, KeyRound, LogOut, Phone, Shield, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";
import { LEGAL_LINKS, PHONE_DISPLAY, PHONE_TEL } from "@/lib/content";
import { functionTitle } from "@/lib/staff-data";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "SIH&S — Profile" }] }),
  component: Profile,
});

function Row({ to, icon, label, detail }: { to: string; icon: ReactNode; label: string; detail?: string }) {
  return (
    <Link to={to} className="flex min-h-[56px] items-center gap-3 border-b border-white/10 px-4 last:border-b-0">
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#0c3328] text-[#8fd86f]">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-medium">{label}</span>
        {detail && <span className="block truncate text-[13px] text-[#c5d4cc]">{detail}</span>}
      </span>
      <ChevronRight size={18} className="text-[#c5d4cc]" aria-hidden />
    </Link>
  );
}

function Profile() {
  const { user, logout } = useStaff();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const initial = user?.fullName.charAt(0) ?? "S";

  return (
    <div className="px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
      <h1 className="text-[28px] font-bold">Profile</h1>
      <section className="mt-4 flex items-center gap-3 rounded-[16px] border border-white/15 bg-[#06281f] p-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5fbb3f] text-[22px] font-bold text-[#001e16]">{initial}</span>
        <div>
          <p className="text-[18px] font-semibold">{user?.fullName}</p>
          <p className="text-[14px] text-[#c5d4cc]">{user?.email}</p>
          <p className="text-[13px] text-[#c5d4cc]">{user?.organization} · Member since {user?.memberSince}</p>
        </div>
      </section>
      <ul className="mt-3 flex flex-wrap gap-2">
        {(user?.approvedRoles ?? []).map((code) => (
          <li key={code} className="rounded-md bg-[#5fbb3f] px-2 py-1 text-xs font-semibold text-[#001e16]">{functionTitle(code)}</li>
        ))}
      </ul>

      <h2 className="mb-2 mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#c5d4cc]">Account</h2>
      <nav className="overflow-hidden rounded-[16px] border border-white/15 bg-[#06281f]" aria-label="Account">
        <Row to="/profile-edit" icon={<UserRound size={18} aria-hidden />} label="Personal Information" />
        <Row to="/qualifications" icon={<FileText size={18} aria-hidden />} label="My Qualifications" />
        <Row to="/roles" icon={<Shield size={18} aria-hidden />} label="My Roles and Access" detail="Roles are assigned by SIH&S" />
        <Row to="/tracking" icon={<Shield size={18} aria-hidden />} label="Tracking and Privacy" />
        <Row to="/password" icon={<KeyRound size={18} aria-hidden />} label="Security" detail="Change password. The saved password is never shown." />
        <Row to="/notifications" icon={<Phone size={18} aria-hidden />} label="Notification Preferences" />
      </nav>

      <h2 className="mb-2 mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#c5d4cc]">Legal & Compliance</h2>
      <nav className="overflow-hidden rounded-[16px] border border-white/15 bg-[#06281f]" aria-label="Legal and compliance">
        {LEGAL_LINKS.map((link) => (
          <Row key={link.id} to={`/legal/${link.id}`} icon={<FileText size={18} aria-hidden />} label={link.title} />
        ))}
      </nav>

      <h2 className="mb-2 mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#c5d4cc]">Help</h2>
      <a href={`tel:${PHONE_TEL}`} className="flex min-h-11 items-center font-semibold text-[#8fd86f]">Call {PHONE_DISPLAY}</a>
      <Link to="/report" className="inline-flex min-h-11 items-center font-semibold text-[#8fd86f]">Report an Incident or Concern</Link>
      <Link to="/exceptions" search={{ screen: "" }} className="block min-h-11 font-semibold text-[#8fd86f]">Exception screens</Link>

      <button type="button" className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#e7c5c5] font-semibold text-[#f0b4b4]" onClick={() => setConfirm(true)}>
        <LogOut size={18} aria-hidden />
        Log Out
      </button>
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="w-full max-w-[480px] rounded-t-[16px] bg-[#06281f] p-4">
            <h2 id="logout-title" className="text-xl font-semibold">Log out of SIH&S?</h2>
            <div className="mt-4 flex gap-3">
              <button type="button" className="min-h-11 flex-1 rounded-md border border-white/20 font-semibold" onClick={() => setConfirm(false)}>Stay</button>
              <button type="button" className="min-h-11 flex-1 rounded-md bg-[#001e16] font-semibold" onClick={() => { logout(); navigate({ to: "/login" }); }}>Log Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
