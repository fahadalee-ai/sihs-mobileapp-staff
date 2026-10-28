import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { ScreenHeader } from "@/components/Chrome";
import { Button, Field, Textarea } from "@/components/kit";
import type { Job, Source } from "@/lib/staff-data";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app/field/$id")({
  head: () => ({ meta: [{ title: "SIH&S — Job status" }] }),
  component: FieldFlow,
});

const STEPS = [
  { label: "On the way", action: "On the way", event: "On the way", note: "Location sharing stays on for this assignment. Any arrival time shown is an estimate only." },
  { label: "I'm arrived", action: "I'm arrived", event: "I'm arrived", note: "Arrival does not mean work has started." },
  { label: "Job starts", action: "Job starts", event: "Job started", note: "Starting the job is separate from arrival." },
  { label: "Job end / completed", action: "Job end / completed", event: "Job ended", note: "Ending the job does not send it in. The report is next." },
  { label: "Submit report", action: "Submit report", event: "Report submitted", note: "Add images and a video. You do not approve your own work." },
] as const;

function completedCount(job: Job) {
  const blob = [job.latestLabel, job.status, ...job.events.map((event) => event.type)].join(" ").toLowerCase();
  if (blob.includes("report submitted") || job.status.startsWith("Submitted") || job.status === "Completed") return 5;
  if (blob.includes("job ended")) return 4;
  if (blob.includes("job started") || blob.includes("work started")) return 3;
  if (blob.includes("i'm arrived") || blob.includes("on scene") || blob.includes("arrived")) return 2;
  if (blob.includes("on the way") || blob.includes("en route")) return 1;
  return 0;
}

function FieldFlow() {
  const { id } = Route.useParams();
  const { jobs, advance, addEvent, user } = useStaff();
  const job = jobs.find((item) => item.id === id);
  const [photo, setPhoto] = useState("");
  const [video, setVideo] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const source: Source = user?.workerType === "employee" ? "Employee-entered" : "Contractor-entered";

  if (!job) {
    return (
      <div>
        <ScreenHeader title="Job status" backTo="/jobs" backLabel="Jobs" />
        <p className="px-4 text-sm">You don't have access to this record. Contact SIH&S.</p>
      </div>
    );
  }

  const done = completedCount(job);
  const finished = done >= STEPS.length;

  const save = (index: number) => {
    const step = STEPS[index];
    addEvent(job.id, step.event, source, job.serviceLocation, index === 1 ? "18 m" : "20 m");
    if (index === 2) advance(job.id, { status: "In Progress", latestLabel: step.event, latestSource: source, phase: index });
    else if (index === 4) {
      advance(job.id, {
        status: "Submitted — awaiting SIH&S approval",
        latestLabel: "Report submitted",
        latestSource: source,
        phase: index,
      });
    } else advance(job.id, { latestLabel: step.event, latestSource: source, phase: index });
  };

  return (
    <div>
      <ScreenHeader title="Job status" backTo="/jobs" backLabel="Jobs" />
      <div className="px-4 pb-8">
        <p className="text-sm text-[#c5d4cc]">{job.id}</p>
        <h2 className="text-xl font-semibold">{job.service}</h2>
        <p className="mt-1 text-sm text-[#c5d4cc]">{job.serviceLocation}</p>

        <ol className="mt-5 space-y-2">
          {STEPS.map((step, index) => {
            const state = finished || index < done ? "done" : index === done ? "now" : "later";
            return (
              <li key={step.label} className={`rounded-md p-3 ${state === "now" ? "bg-[#06281f] ring-1 ring-[#5fbb3f]" : "bg-[#06281f]"}`}>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      state === "done" ? "bg-[#5fbb3f] text-[#001e16]" : state === "now" ? "bg-[#8fd86f] text-[#001e16]" : "bg-[#0c3328] text-[#c5d4cc]"
                    }`}
                  >
                    {state === "done" ? <Check size={16} aria-hidden /> : index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{step.label}</span>
                    <span className="block text-xs text-[#c5d4cc]">
                      {state === "done" ? `Saved · Source: ${source}` : state === "now" ? "Update this status now" : "Available after the step above"}
                    </span>
                  </span>
                </div>
                {state === "now" && index < 4 && (
                  <div className="mt-3">
                    <p className="text-sm text-[#c5d4cc]">{step.note}</p>
                    <Button type="button" full className="mt-3" onClick={() => save(index)}>
                      {step.action}
                    </Button>
                  </div>
                )}
                {state === "now" && index === 4 && (
                  <form
                    className="mt-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (!photo || !video) {
                        setError("Add at least one image and one video before you submit the report.");
                        return;
                      }
                      setError("");
                      save(4);
                    }}
                  >
                    <p className="text-sm text-[#c5d4cc]">{step.note}</p>
                    <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-white/15 px-3 text-sm font-semibold">
                      {photo ? `Image added · ${photo}` : "Add image"}
                      <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => setPhoto(event.target.files?.[0]?.name ?? "")} />
                    </label>
                    <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-white/15 px-3 text-sm font-semibold">
                      {video ? `Video added · ${video}` : "Add video"}
                      <input type="file" accept="video/*" capture="environment" className="sr-only" onChange={(event) => setVideo(event.target.files?.[0]?.name ?? "")} />
                    </label>
                    <div className="mt-3">
                      <Field label="What you completed" error={error || undefined}>
                        <Textarea value={note} onChange={(event) => setNote(event.target.value)} />
                      </Field>
                    </div>
                    <Button type="submit" full>
                      Submit report
                    </Button>
                  </form>
                )}
              </li>
            );
          })}
        </ol>

        {finished && (
          <p className="mt-4 rounded-md bg-[#06281f] p-3 text-sm" role="status">
            Report submitted — awaiting SIH&S approval. You do not approve your own work.
          </p>
        )}
      </div>
    </div>
  );
}
