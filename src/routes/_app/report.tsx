import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ChevronRight, Phone } from "lucide-react";
import { useState } from "react";
import { Art } from "@/components/Art";
import { CallHook } from "@/components/Chrome";
import { Button, Field, Textarea } from "@/components/kit";
import { PHONE_DISPLAY } from "@/lib/content";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app/report")({
  head: () => ({ meta: [{ title: "SIH&S — Report" }] }),
  component: ReportScreen,
});

const CATEGORIES = [
  "Vehicle accident",
  "Injury or illness",
  "Property damage",
  "Near miss",
  "Unsafe condition",
  "Equipment problem",
  "Complaint",
  "Other",
];

function localNow() {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function ReportScreen() {
  const { reports, submitReport, jobs } = useStaff();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [body, setBody] = useState("");
  const [when, setWhen] = useState(localNow);
  const [jobId, setJobId] = useState("");
  const [place, setPlace] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [restricted, setRestricted] = useState(false);
  const [ref, setRef] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="px-4 pb-8 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <p className="text-sm text-[#c5d4cc]">Safety</p>
      <h1 className="text-[28px] font-semibold leading-tight tracking-tight">Report an Incident or Concern</h1>

      <section className="mt-4 rounded-md bg-[#06281f] p-4" aria-label="Emergency">
        <p className="flex items-start gap-2 text-sm font-semibold">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#8fd86f]" aria-hidden />
          If anyone is in danger, call 911 first.
        </p>
        <a href="tel:911" className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#5fbb3f] px-4 text-sm font-semibold text-[#001e16]">
          <Phone size={18} aria-hidden />
          Call 911
        </a>
        <p className="mt-3 text-xs text-[#c5d4cc]">Then call SIH&S · {PHONE_DISPLAY}</p>
        <CallHook />
      </section>

      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!body.trim()) {
            setError("Describe what happened. Nothing else is required.");
            return;
          }
          setError("");
          const text = [
            body.trim(),
            when && `When: ${when.replace("T", " ")}`,
            place.trim() && `Location: ${place.trim()}`,
            photoName && `Photo: ${photoName}`,
          ]
            .filter(Boolean)
            .join(" ");
          setRef(submitReport({ category, body: text, jobId: jobId || undefined, restrictedRoute: restricted }));
          setBody("");
          setPlace("");
          setPhotoName("");
          setJobId("");
          setRestricted(false);
        }}
      >
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">What to report</h2>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Category">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              className={`min-h-11 rounded-md px-3 text-sm font-semibold ${category === item ? "bg-[#5fbb3f] text-[#001e16]" : "border border-white/15 bg-[#06281f]"}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-md bg-[#06281f] p-3">
          <Field label="What happened" error={error || undefined}>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
          <Field label="Date and time">
            <input
              type="datetime-local"
              className="min-h-11 w-full rounded-xl border border-white/15 bg-[#0c3328] px-3 text-sm text-[#f4f7f5]"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
            />
          </Field>
          <p className="text-xs leading-snug text-[#c5d4cc]">No active job, GPS, photo, or complete information is required.</p>
        </div>

        <h2 className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">Optional</h2>
        <div className="rounded-md bg-[#06281f] p-3">
          <Field label="Related job">
            <select
              className="min-h-11 w-full rounded-xl border border-white/15 bg-[#0c3328] px-3 text-sm text-[#f4f7f5]"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
            >
              <option value="">None</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.id} · {job.service}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Location">
            <Textarea value={place} onChange={(e) => setPlace(e.target.value)} />
          </Field>
          <label className="flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-white/15 px-3 text-sm font-semibold">
            {photoName ? `Photo added · ${photoName}` : "Add a photo"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")}
            />
          </label>
        </div>

        <label className="mt-3 flex items-start gap-3 rounded-md bg-[#06281f] p-3 text-sm">
          <input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={restricted} onChange={(e) => setRestricted(e.target.checked)} />
          <span>
            <span className="block font-semibold">My concern involves my usual supervisor</span>
            <span className="mt-1 block text-[#c5d4cc]">This routes to Safety/HR and is hidden from that supervisor.</span>
          </span>
        </label>

        <Button type="submit" full className="mt-4">
          Submit report
        </Button>
      </form>

      {ref && (
        <section className="mt-4 rounded-md border border-[#5fbb3f]/50 bg-[#06281f] p-4" role="status">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8fd86f]">Report received</p>
          <p className="mt-1 text-lg font-semibold">{ref}</p>
          <p className="mt-1 text-sm text-[#c5d4cc]">A reviewer will be assigned. This is not a claim.</p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">My Reports</h2>
        {reports.length === 0 ? (
          <div className="mt-2 rounded-md bg-[#06281f] px-3 py-6 text-center">
            <Art kind="empty" className="mx-auto h-28 w-full" />
            <p className="mt-2 text-sm text-[#c5d4cc]">No reports yet.</p>
          </div>
        ) : (
          <ul className="mt-2 space-y-2">
            {reports.map((item) => (
              <li key={item.id} className="rounded-md bg-[#06281f] p-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#8fd86f]">{item.id}</p>
                    <h3 className="mt-1 font-semibold">{item.category}</h3>
                  </div>
                  <span className="shrink-0 rounded-md bg-[#5fbb3f] px-2 py-1 text-[11px] font-semibold text-[#001e16]">{item.status}</span>
                </div>
                <p className="mt-2 leading-snug">{item.body}</p>
                <p className="mt-2 text-xs text-[#c5d4cc]">
                  {item.restrictedRoute ? "Restricted route. Hidden from the usual supervisor." : "Standard route."}
                  {item.reviewer ? ` Reviewer: ${item.reviewer}.` : " A reviewer has not been assigned yet."}
                </p>
                <div className="mt-3 border-t border-white/10 pt-3">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[#c5d4cc]">Updates</h4>
                  {item.updates.length === 0 ? (
                    <p className="mt-1 text-xs text-[#c5d4cc]">No updates. The original report stays read-only.</p>
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {item.updates.map((update) => (
                        <li key={update.at}>{update.body}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link to="/upload" className="mt-4 flex min-h-12 items-center justify-between rounded-md border border-white/15 px-3 text-sm font-semibold">
        <span>
          Restricted Incident Upload
          <span className="mt-0.5 block text-xs font-normal text-[#c5d4cc]">Longer original videos. Not trimmed.</span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-[#8fd86f]" aria-hidden />
      </Link>
    </div>
  );
}
