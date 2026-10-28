import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { Art } from "@/components/Art";
import { CallHook, ScreenHeader } from "@/components/Chrome";
import { Button } from "@/components/kit";

const searchSchema = z.object({ screen: z.string().catch("") });

export const Route = createFileRoute("/_app/exceptions")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "SIH&S — Exceptions" }] }),
  component: Exceptions,
});

const SCREENS: { id: string; title: string }[] = [
  { id: "arrival", title: "Inaccurate arrival" },
  { id: "accuracy", title: "Location accuracy" },
  { id: "tracking", title: "Tracking interrupted" },
  { id: "photos", title: "Missing photos" },
  { id: "checkout", title: "Documentation incomplete" },
  { id: "offline", title: "Offline" },
  { id: "upload", title: "Upload failed" },
  { id: "duplicate", title: "Duplicate submission" },
  { id: "conflict", title: "Conflicting status" },
  { id: "denied", title: "No access" },
  { id: "expired", title: "Qualification expired" },
  { id: "session", title: "Session expired" },
  { id: "removed", title: "Access removed" },
  { id: "correction", title: "Correction and approval" },
  { id: "empty", title: "Empty states" },
];

function Exceptions() {
  const { screen } = Route.useSearch();
  const navigate = useNavigate();
  if (!screen) {
    return (
      <div>
        <ScreenHeader title="Exception screens" backTo="/profile" />
        <ul className="px-4 pb-8">
          {SCREENS.map((item) => (
            <li key={item.id}>
              <button type="button" className="min-h-11 text-left text-sm font-semibold text-[#8fd86f] underline" onClick={() => navigate({ to: "/exceptions", search: { screen: item.id } })}>
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="Exception" backTo="/profile" />
      <div className="space-y-3 px-4 pb-8 text-sm">
        <Panel screen={screen} />
        <button type="button" className="min-h-11 font-semibold text-[#8fd86f] underline" onClick={() => navigate({ to: "/exceptions", search: { screen: "" } })}>
          All exception screens
        </button>
      </div>
    </div>
  );
}

function AlertText({ children }: { children: string }) {
  return (
    <p className="flex items-start gap-2 font-medium" role="alert">
      <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function Panel({ screen }: { screen: string }) {
  if (screen === "arrival") {
    return (
      <>
        <h2 className="text-xl font-semibold">Arrival detection needs a check</h2>
        <AlertText>The automatic arrival does not match where you are. Correct it manually.</AlertText>
        <p>Reasons: poor GPS, indoor, or an approved alternative. Source: Employee-entered. The automatic event stays on the timeline.</p>
        <Button type="button">Correct arrival</Button>
      </>
    );
  }
  if (screen === "accuracy") {
    return (
      <>
        <h2 className="text-xl font-semibold">Location accuracy is poor</h2>
        <AlertText>Location unavailable or stale. Confirm the service location before you rely on it.</AlertText>
        <Button type="button">Enter the location manually</Button>
      </>
    );
  }
  if (screen === "tracking") {
    return (
      <>
        <h2 className="text-xl font-semibold">Location sharing interrupted</h2>
        <AlertText>Permission was revoked, battery saver is on, or the session signed out.</AlertText>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Open settings and allow location while using the assignment.</li>
          <li>Turn off battery restrictions for SIH&S during the assignment.</li>
          <li>Sign in again if the session ended. Unsent items stay on the device.</li>
        </ol>
        <Button type="button">Fix now</Button>
      </>
    );
  }
  if (screen === "photos") {
    return (
      <>
        <h2 className="text-xl font-semibold">Completion is blocked</h2>
        <AlertText>Before photo of the loading area is missing.</AlertText>
        <AlertText>After photo of the same area is missing.</AlertText>
        <p>Submit Completion stays off until these are captured in the app.</p>
      </>
    );
  }
  if (screen === "checkout") {
    return (
      <>
        <h2 className="text-xl font-semibold">Checked out—documentation incomplete</h2>
        <p>Missing: after photo, handoff name.</p>
        <p>Departure does not mean work is complete.</p>
        <Button type="button">Complete Now</Button>
      </>
    );
  }
  if (screen === "offline") {
    return (
      <>
        <h2 className="text-xl font-semibold">Saved locally</h2>
        <p>You are offline. The arrival event is saved on this device. It is not received yet.</p>
        <Button type="button">Retry when online</Button>
      </>
    );
  }
  if (screen === "upload") {
    return (
      <>
        <h2 className="text-xl font-semibold">Upload failed — will retry</h2>
        <p>The SharePoint packet stayed on this device. It is not archived.</p>
        <Button type="button">Retry now</Button>
      </>
    );
  }
  if (screen === "duplicate") return <><h2 className="text-xl font-semibold">Already submitted</h2><p>This event is already in the queue. A second copy was not created.</p></>;
  if (screen === "conflict") return <><h2 className="text-xl font-semibold">Update conflicts with a later status — sent to dispatch for review.</h2><p>The later status stays in place.</p></>;
  if (screen === "denied") {
    return (
      <>
        <h2 className="text-xl font-semibold">You don't have access to this record. Contact SIH&S.</h2>
        <CallHook />
      </>
    );
  }
  if (screen === "expired") {
    return (
      <>
        <h2 className="text-xl font-semibold">Qualification expired — contact SIH&S.</h2>
        <p>Collector training expired Aug 1, 2026. Assignments for that function are blocked.</p>
        <p>A replacement upload shows Submitted—pending verification. It is not verified until SIH&S approves it.</p>
        <CallHook />
      </>
    );
  }
  if (screen === "session") return <><h2 className="text-xl font-semibold">Session expired</h2><p>Unsent items are preserved on this device.</p><Button type="button">Sign in</Button></>;
  if (screen === "removed") return <><h2 className="text-xl font-semibold">Your access has ended.</h2><p>Records are no longer shown. Contact SIH&S if you believe this is an error.</p><CallHook /></>;
  if (screen === "correction") {
    return (
      <>
        <h2 className="text-xl font-semibold">Correction and approval</h2>
        <p>Correction submitted. The original entry is still visible.</p>
        <p>Returned for correction: quantity was missing. Correct and Resubmit is available.</p>
        <p>Approved by SIH&S. Staff did not approve their own work.</p>
      </>
    );
  }
  return (
    <>
      <h2 className="text-xl font-semibold">Nothing here yet</h2>
      <Art kind="empty" className="h-36 w-full" />
      <p>No jobs today. No reports. No log entries.</p>
    </>
  );
}
