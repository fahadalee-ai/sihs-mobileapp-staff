import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Art } from "@/components/Art";
import { ScreenHeader } from "@/components/Chrome";
import { Button, Field, Input, Textarea } from "@/components/kit";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app/pim/$id")({
  head: () => ({ meta: [{ title: "SIH&S — PIM-VEE™" }] }),
  component: PimWorkspace,
});

const TABS = ["Scene and vehicle media", "Statements and leads", "Potential cameras", "Release to investigators"] as const;

function PimWorkspace() {
  const { id } = Route.useParams();
  const { jobs } = useStaff();
  const job = jobs.find((item) => item.id === id);
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const [statementTab, setStatementTab] = useState<"Original" | "Summary">("Original");
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState("");

  if (!job) {
    return (
      <div>
        <ScreenHeader title="PIM-VEE™" backTo="/jobs" />
        <p className="px-4 text-sm">You don't have access to this record. Contact SIH&S.</p>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="PIM-VEE™" backTo="/jobs" />
      <div className="px-4 pb-8 text-sm">
        <h2 className="text-xl font-semibold">PIM-VEE™</h2>
        <p className="mt-1 font-semibold">Employer-Directed | Non-Investigative | No Scene Control | No Evidence Handling</p>
        <p className="mt-2 text-[#c5d4cc]">{job.id} · {job.serviceLocation}</p>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {TABS.map((item) => (
            <button key={item} type="button" className={`min-h-11 shrink-0 rounded-md px-3 text-xs font-semibold ${tab === item ? "bg-[#5fbb3f] text-[#001e16]" : "border border-white/15"}`} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </div>

        {tab === "Scene and vehicle media" && (
          <section className="mt-4 space-y-2">
            <p>Photos and short videos with factual observation notes. Originals stay untouched if a copy is annotated.</p>
            <Field label="Factual observation">
              <Textarea placeholder="" />
            </Field>
          </section>
        )}

        {tab === "Statements and leads" && (
          <section className="mt-4 space-y-3">
            <div className="flex gap-2">
              {(["Original", "Summary"] as const).map((item) => (
                <button key={item} type="button" className={`min-h-11 rounded-md px-3 text-sm font-semibold ${statementTab === item ? "bg-[#5fbb3f] text-[#001e16]" : "border border-white/15"}`} onClick={() => setStatementTab(item)}>
                  {item}
                </button>
              ))}
            </div>
            {statementTab === "Original" ? (
              <p>Original statement is read-only after it is saved.</p>
            ) : (
              <Field label="Summary">
                <Textarea />
              </Field>
            )}
            <Field label="Information provider"><Input /></Field>
            <Field label="Contact details"><Input /></Field>
            <Field label="Classification">
              <select className="min-h-11 w-full rounded-xl border border-border bg-card px-3">
                <option>Personally observed</option>
                <option>Reported by someone else</option>
                <option>Unverified</option>
              </select>
            </Field>
            <section className="rounded-md border border-white/15 p-3">
              <h3 className="font-semibold">Recorded statement</h3>
              <p className="mt-1">Not started until consent is confirmed.</p>
              <label className="mt-2 flex items-start gap-3">
                <input type="checkbox" className="mt-1 h-5 w-5" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>The person consents to a recording. Recorder identity and purpose are on the consent.</span>
              </label>
              {consent && <p className="mt-2">Recording controls stay off in this design preview.</p>}
            </section>
          </section>
        )}

        {tab === "Potential cameras" && (
          <section className="mt-4 space-y-3">
            <p className="rounded-md border border-white/15 p-3 font-semibold">A visible camera does not mean it recorded the incident.</p>
            <Art kind="map" className="h-32 w-full rounded-md" />
            <Field label="Apparent viewing direction"><Input /></Field>
            <Field label="Known owner or contact"><Input /></Field>
            <Field label="Reported footage-overwrite deadline"><Input /></Field>
            <p className="text-xs text-[#c5d4cc]">Deadline source: Reported by someone else</p>
          </section>
        )}

        {tab === "Release to investigators" && (
          <section className="mt-4 space-y-3">
            <Field label="Authorized recipient"><Input defaultValue="Employer designated recipient" /></Field>
            <Button type="button" onClick={() => setSent("Sent by Dana Brooks. Acknowledgment is still open.")}>Send selected records</Button>
            {sent && <p role="status">{sent} The log keeps what was sent, who sent it, and when.</p>}
          </section>
        )}
      </div>
    </div>
  );
}
