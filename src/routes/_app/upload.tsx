import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/Chrome";
import { Button } from "@/components/kit";

export const Route = createFileRoute("/_app/upload")({
  head: () => ({ meta: [{ title: "SIH&S — Restricted upload" }] }),
  component: Upload,
});

function Upload() {
  const [name, setName] = useState("");
  return (
    <div>
      <ScreenHeader title="Restricted Incident Upload" backTo="/report" />
      <div className="px-4 pb-8 text-sm">
        <p>Upload a longer original video linked to an incident. The app does not trim it.</p>
        <label className="mt-4 block font-semibold">
          Original video
          <input type="file" accept="video/*" className="mt-2 block w-full font-normal" onChange={(e) => setName(e.target.files?.[0]?.name ?? "")} />
        </label>
        {name && <p className="mt-3 font-semibold" role="status">Original preserved. Not trimmed. {name} is saved on this device until it is received.</p>}
        <Button type="button" className="mt-4" disabled={!name}>Submit original</Button>
      </div>
    </div>
  );
}
