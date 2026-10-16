import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PHONE_DISPLAY, PHONE_TEL, SERVICES, greeting } from "@/lib/content";
import { customerStatusLabel } from "@/lib/customer-config";
import { useApp } from "@/lib/store";
import iconTowing from "@/img/Services_01-elaware-Intrastate-Towing.png";
import iconLockouts from "@/img/Services_02-Lockouts.png";
import iconJump from "@/img/Services_03-Jump-Starts.png";
import iconFuel from "@/img/Services_04-Fuel-Delivery.png";
import iconCollections from "@/img/Services_05-Drug-Alcohol-Collections.png";
import iconDna from "@/img/Services_06-DNA-Services.png";
import iconPimvee from "@/img/Services_07-PIM-VEE.png";
import iconNotary from "@/img/Services_08-Notary.png";

export const Route = createFileRoute("/_app/home")({
  head: () => ({ meta: [{ title: "SIH&S — Home" }] }),
  component: Home,
});

const ICONS: Record<string, string> = {
  towing: iconTowing,
  lockouts: iconLockouts,
  "jump-starts": iconJump,
  "fuel-delivery": iconFuel,
  "drug-alcohol": iconCollections,
  dna: iconDna,
  "pim-vee": iconPimvee,
  notary: iconNotary,
};

function Home() {
  const { user, guest, setDraft, bookings } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const appointments = SERVICES.filter((service) => service.kind === "appointment");
  const first = user?.fullName.split(" ")[0] ?? "there";

  const dispatchServices = SERVICES.filter((service) => service.kind === "dispatch");
  const extraServices = [
    { slug: "lawncare", title: "Lawncare" },
    { slug: "janitorial", title: "Janitorial" },
    { slug: "courier", title: "Courier or Product Delivery" },
    { slug: "transport", title: "Employee Transportation" },
    { slug: "supplies", title: "Supplies or Products" },
    { slug: "other", title: "Other / Not listed" },
  ];
  const tiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SERVICES;
    return SERVICES.filter((s) => `${s.title} ${s.short} ${s.descriptor}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="px-4 pb-6 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">SIH&S</p>
          <h1 className="text-xl font-semibold">
            {greeting()}, {guest ? "Guest" : first}
          </h1>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setNotesOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card"
        >
          <Bell size={20} aria-hidden />
        </button>
      </div>
      {notesOpen && (
        <div className="mt-3 rounded-md border border-border bg-card p-3 text-sm" role="status">
          {bookings.length === 0 ? (
            <p>No new notifications.</p>
          ) : (
            <ul className="space-y-2">
              {bookings.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <button type="button" className="min-h-11 text-left font-semibold text-[#8fd86f] underline" onClick={() => navigate({ to: "/requests/$id", params: { id: item.id } })}>
                    {item.id}: {customerStatusLabel(item.status, item.customerLabel)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <label className="mt-4 block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Search
        </span>
        <span className="flex items-center gap-2 rounded-md border border-border bg-card px-3">
          <Search size={18} aria-hidden className="text-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services..."
            className="min-h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-[#c5d4cc]"
          />
        </span>
      </label>

      <p className="mt-4 text-sm text-muted-foreground">
        Pending requests: {bookings.filter((item) => item.status === "pending" || item.status === "ongoing").length}.{" "}
        {bookings[0] ? customerStatusLabel(bookings[0].status, bookings[0].customerLabel) : "No requests yet."}
      </p>
      <a href={`tel:${PHONE_TEL}`} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-accent-text underline">
        Call SIH&S {PHONE_DISPLAY}
      </a>
      <button
        type="button"
        onClick={() => setDispatchOpen(true)}
        className="mt-4 w-full rounded-md bg-[#5fbb3f] p-4 text-left text-[#001e16]"
      >
        <span className="block text-base font-semibold">Request Dispatch</span>
        <span className="mt-1 block text-sm text-[#001e16]/80">
          Submit a request. SIH&S reviews and confirms before dispatch.
        </span>
      </button>

      {bookings.some((item) => item.status !== "completed" && item.status !== "canceled") && (
        <section className="mt-4 rounded-md border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Active requests</h2>
            <button type="button" className="min-h-11 text-sm font-semibold text-accent-text underline" onClick={() => navigate({ to: "/bookings" })}>
              View all
            </button>
          </div>
          {bookings
            .filter((item) => item.status !== "completed" && item.status !== "canceled")
            .slice(0, 3)
            .map((item) => (
              <button key={item.id} type="button" className="mt-2 w-full text-left" onClick={() => navigate({ to: "/requests/$id", params: { id: item.id } })}>
                <p className="font-semibold">{item.id}</p>
                <p className="text-sm">{item.serviceTitle}</p>
                <p className="mt-1 inline-flex rounded-md bg-[#5fbb3f] px-2 py-1 text-xs font-semibold text-[#001e16]">
                  {customerStatusLabel(item.status, item.customerLabel)}
                </p>
              </button>
            ))}
        </section>
      )}

      <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Services</h2>
      <ul className="grid grid-cols-2 gap-3">
        {tiles.map((service) => (
          <li key={service.slug}>
            <Link
              to="/services/$slug"
              params={{ slug: service.slug }}
              className={`flex h-full min-h-[168px] flex-col overflow-hidden rounded-[16px] border bg-[#06281f] shadow-[0_8px_20px_rgba(0,0,0,0.25)] ${
                service.prominent ? "border-[#5fbb3f] ring-2 ring-[#5fbb3f]" : "border-white/15"
              }`}
            >
              <span className="flex h-[108px] items-center justify-center bg-[#0c3328] px-3">
                <img
                  src={ICONS[service.slug]}
                  alt=""
                  className={`w-auto object-contain ${service.prominent ? "h-[92px]" : "h-[84px]"}`}
                />
              </span>
              <span className="flex flex-1 items-center justify-center px-3 py-3 text-center text-[14px] font-semibold leading-snug text-[#f4f7f5]">
                {service.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {query.trim() && (
        <ul className="mt-3 space-y-2">
          {extraServices
            .filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()))
            .map((item) => (
              <li key={item.slug}>
                <button
                  type="button"
                  className="min-h-11 w-full rounded-md border border-white/15 bg-[#06281f] px-3 text-left text-sm font-semibold"
                  onClick={() => {
                    setDraft({ serviceSlug: item.slug });
                    navigate({ to: "/request", search: { slug: item.slug } });
                  }}
                >
                  {item.title}
                </button>
              </li>
            ))}
        </ul>
      )}
      {tiles.length === 0 && !extraServices.some((item) => item.title.toLowerCase().includes(query.trim().toLowerCase())) && (
        <p className="mt-4 text-sm">No services match that search.</p>
      )}
      <button
        type="button"
        onClick={() => {
          setDraft({ serviceSlug: "other" });
          navigate({ to: "/request", search: { slug: "other" } });
        }}
        className="mt-3 flex min-h-11 w-full items-center justify-center rounded-md border border-white/20 px-4 text-sm font-semibold"
      >
        Request Something Else
      </button>

      <button
        type="button"
        onClick={() => {
          setPicked(null);
          setBookingOpen(true);
        }}
        className="relative z-10 mt-5 flex min-h-11 w-full cursor-pointer items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
      >
        Book Appointment
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        DNA, Drug & Alcohol, Notary, and PIM-VEE™ use appointment scheduling. Towing and roadside use Request Dispatch.
      </p>

      <section className="mt-8 rounded-md border border-border bg-card p-4" aria-label="Standing in the Gap">
        <h2 className="text-base font-semibold">Standing in the Gap</h2>
        <p className="mt-3 text-sm leading-relaxed">
          “And I sought for a man among them, that should make up the hedge, and stand in the gap before me for the
          land, that I should not destroy it: but I found none.” — Ezekiel 22:30
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          “That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath
          raised him from the dead, thou shalt be saved.” — Romans 10:9
        </p>
      </section>

      {dispatchOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="dispatch-title">
          <div className="w-full max-w-[480px] rounded-t-[16px] bg-[#06281f] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-[#f4f7f5]">
            <h2 id="dispatch-title" className="text-[20px] font-semibold">Which roadside service?</h2>
            <ul className="mt-4 overflow-hidden rounded-[12px] border border-white/15">
              {dispatchServices.map((service) => (
                <li key={service.slug} className="border-b border-white/10 last:border-b-0">
                  <button
                    type="button"
                    className="flex min-h-12 w-full items-center px-3 text-left text-[16px] font-medium"
                    onClick={() => {
                      setDraft({ serviceSlug: service.slug });
                      setDispatchOpen(false);
                      navigate({ to: "/request", search: { slug: service.slug } });
                    }}
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="mt-2 min-h-11 w-full text-[15px] font-semibold text-[#c5d4cc]" onClick={() => setDispatchOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="book-title">
          <div className="w-full max-w-[480px] rounded-t-[16px] bg-[#06281f] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-[#f4f7f5]">
            <h2 id="book-title" className="text-[20px] font-semibold text-[#f4f7f5]">
              Book an appointment
            </h2>
            <p className="mt-1 text-[14px] text-[#c5d4cc]">Choose the service to schedule.</p>
            <ul className="mt-4 overflow-hidden rounded-[12px] border border-white/15">
              {appointments.map((service) => (
                <li key={service.slug} className="border-b border-white/10 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setPicked(service.slug)}
                    className={`flex min-h-12 w-full items-center px-3 text-left text-[16px] font-medium ${
                      picked === service.slug ? "bg-[#0c3328] text-[#8fd86f]" : "text-[#f4f7f5]"
                    }`}
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
            {picked === "dna" || picked === "drug-alcohol" ? (
              <div className="mt-4 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  className="min-h-11 rounded-[12px] bg-[#5fbb3f] text-[15px] font-semibold text-[#001e16]"
                  onClick={() => {
                    setDraft({ serviceSlug: picked, locationType: "mobile" });
                    setBookingOpen(false);
                    navigate({ to: "/request", search: { slug: picked } });
                  }}
                >
                  Schedule mobile collection
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-[12px] border border-white/20 text-[15px] font-semibold text-[#f4f7f5]"
                  onClick={() => {
                    setDraft({ serviceSlug: picked, locationType: "in-office" });
                    setBookingOpen(false);
                    navigate({ to: "/request", search: { slug: picked } });
                  }}
                >
                  Schedule in-office, Wilmington
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={!picked}
                className="mt-4 min-h-11 w-full rounded-[12px] bg-[#5fbb3f] text-[15px] font-semibold text-[#001e16] disabled:bg-[#c5d0c8] disabled:text-[#3d4a44]"
                onClick={() => {
                  if (!picked) return;
                  setDraft({ serviceSlug: picked });
                  setBookingOpen(false);
                  navigate({ to: "/request", search: { slug: picked } });
                }}
              >
                Continue
              </button>
            )}
            <button type="button" className="mt-2 min-h-11 w-full text-[15px] font-semibold text-[#c5d4cc]" onClick={() => setBookingOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
