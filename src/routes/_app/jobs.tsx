import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Art } from "@/components/Art";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app/jobs")({
  head: () => ({ meta: [{ title: "SIH&S — Jobs" }] }),
  component: Jobs,
});

const TABS = ["Assigned", "In Progress", "Completed", "Needs Attention"] as const;

function Jobs() {
  const { jobs, showAllJobs, user } = useStaff();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Assigned");
  const navigate = useNavigate();
  const role = user?.activeRole;
  const list = jobs.filter((job) => {
    const roleOk = showAllJobs || !role || job.functionCode === role || user?.approvedRoles.includes(job.functionCode);
    if (!showAllJobs && role && job.functionCode !== role) return false;
    if (!roleOk) return false;
    if (tab === "Needs Attention") return job.status === "Needs Attention" || job.status === "Waiting for approval" || job.status === "Checked out—documentation incomplete";
    if (tab === "In Progress") return job.status === "In Progress" || job.status === "Submitted — awaiting SIH&S approval";
    return job.status === tab;
  });

  return (
    <div className="px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-semibold">Jobs</h1>
      <div className="mt-4 grid grid-cols-2 gap-2" role="tablist" aria-label="Job status">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            className={`min-h-11 rounded-md px-2 text-sm font-semibold ${tab === item ? "bg-[#5fbb3f] text-[#001e16]" : "border border-white/15"}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {list.length === 0 && (
          <div className="rounded-md border border-dashed border-white/20 p-6 text-center">
            <Art kind="empty" className="mx-auto h-32 w-full" />
            <p className="mt-2 text-sm font-semibold">No jobs in {tab}</p>
          </div>
        )}
        {list.map((job) => (
          <article key={job.id} className="rounded-[16px] border border-white/15 bg-[#06281f] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-[#c5d4cc]">{job.id}</p>
                <p className="mt-1 inline-flex rounded-md border border-white/20 px-2 py-1 text-xs font-semibold">{job.service}</p>
              </div>
              <span className="rounded-md bg-[#5fbb3f] px-2 py-1 text-xs font-semibold text-[#001e16]">{job.status}</span>
            </div>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-[#c5d4cc]">Property</dt><dd className="text-right">{job.property}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[#c5d4cc]">Time</dt><dd className="text-right">{job.when}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[#c5d4cc]">Service location</dt><dd className="text-right">{job.serviceLocation}</dd></div>
            </dl>
            <p className="mt-2 text-xs text-[#c5d4cc]">Latest update: {job.latestLabel}. Source: {job.latestSource}</p>
            <button type="button" className="mt-2 flex min-h-11 w-full items-center text-sm font-semibold text-[#8fd86f]" onClick={() => navigate({ to: "/jobs/$id", params: { id: job.id } })}>
              Job details
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
