import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Art } from "@/components/Art";
import { ScreenHeader } from "@/components/Chrome";
import { Button, Field, Input } from "@/components/kit";
import { FUNCTIONS, functionTitle, type FunctionCode, type Qualification } from "@/lib/staff-data";
import { useStaff } from "@/lib/staff-store";

export const Route = createFileRoute("/_app/qualifications")({
  head: () => ({ meta: [{ title: "SIH&S — Qualifications" }] }),
  component: Qualifications,
});

function Qualifications() {
  const { qualifications, uploadQualification, updateQualification, user } = useStaff();
  const mine = qualifications.filter((item) => item.userId === user?.id);
  const [editing, setEditing] = useState<Qualification | "new" | null>(null);

  return (
    <div>
      <ScreenHeader title="My Qualifications" backTo="/profile" backLabel="Profile" />
      <div className="px-4 pb-8">
        <p className="text-sm leading-snug text-[#c5d4cc]">
          A document you add or edit stays Submitted—pending verification until SIH&S verifies it. It does not become Verified on its own.
        </p>
        <Button type="button" full className="mt-4" onClick={() => setEditing("new")}>
          <Plus size={18} aria-hidden />
          Add qualification
        </Button>

        {mine.length === 0 ? (
          <div className="mt-4 rounded-md bg-[#06281f] px-3 py-6 text-center">
            <Art kind="empty" className="mx-auto h-28 w-full" />
            <p className="mt-2 text-sm text-[#c5d4cc]">No qualifications on this account yet.</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {mine.map((item) => (
              <li key={item.id} className="rounded-md bg-[#06281f] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8fd86f]">{functionTitle(item.code)}</p>
                    <h2 className="mt-1 text-sm font-semibold">{item.name}</h2>
                  </div>
                  <StatusChip status={item.status} />
                </div>
                {item.expires && <p className="mt-2 text-sm text-[#c5d4cc]">Expires {item.expires}</p>}
                {item.replaces && <p className="mt-1 text-xs text-[#c5d4cc]">Replaces {item.replaces}. The earlier document stays on file.</p>}
                <button type="button" className="mt-2 min-h-11 text-sm font-semibold text-[#8fd86f]" onClick={() => setEditing(item)}>
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <QualForm
          item={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(input) => {
            if (editing === "new") uploadQualification(input.name, input.code, input.expires);
            else updateQualification(editing.id, input);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function StatusChip({ status }: { status: Qualification["status"] }) {
  const attention = status === "Expired" || status === "Rejected";
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${attention ? "bg-[#0c3328] text-[#f4f7f5]" : "bg-[#5fbb3f] text-[#001e16]"}`}>
      {attention && <AlertCircle size={12} aria-hidden />}
      {status}
    </span>
  );
}

function QualForm({
  item,
  onClose,
  onSave,
}: {
  item: Qualification | null;
  onClose: () => void;
  onSave: (input: { name: string; code: FunctionCode; expires?: string }) => void;
}) {
  const [code, setCode] = useState<FunctionCode>(item?.code ?? "TOW");
  const [name, setName] = useState(item?.name ?? "");
  const [expires, setExpires] = useState("");
  const [file, setFile] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="qual-form-title">
      <form
        className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-t-[16px] bg-[#06281f] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) {
            setError("Enter the document name.");
            return;
          }
          if (!item && !file) {
            setError("Upload a photo or PDF for the new qualification.");
            return;
          }
          setError("");
          onSave({ name: file ? `${name.trim()} · ${file}` : name.trim(), code, expires: expires || undefined });
        }}
      >
        <h2 id="qual-form-title" className="text-xl font-semibold">{item ? "Edit qualification" : "Add qualification"}</h2>
        <p className="mt-1 text-sm text-[#c5d4cc]">
          {item ? "Saving sends this back for SIH&S verification. The earlier document stays on file." : "This is a request. SIH&S verifies it before it counts as approved."}
        </p>
        <div className="mt-4">
          <Field label="Job function" error={error || undefined}>
            <select
              className="min-h-11 w-full rounded-xl border border-white/15 bg-[#0c3328] px-3 text-sm text-[#f4f7f5]"
              value={code}
              onChange={(event) => setCode(event.target.value as FunctionCode)}
            >
              {FUNCTIONS.map((fn) => (
                <option key={fn.code} value={fn.code}>
                  {fn.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Document name">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Expiration date" hint="Optional. Leave blank if the document does not expire.">
            <input
              type="date"
              className="min-h-11 w-full rounded-xl border border-white/15 bg-[#0c3328] px-3 text-sm text-[#f4f7f5]"
              value={expires}
              onChange={(event) => setExpires(event.target.value)}
            />
          </Field>
          <label className="mb-4 flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-white/15 px-3 text-sm font-semibold">
            {file ? `File added · ${file}` : item ? "Replace photo or PDF" : "Upload photo or PDF"}
            <input
              type="file"
              accept="image/*,.pdf"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0]?.name ?? "")}
            />
          </label>
        </div>
        <Button type="submit" full>
          {item ? "Save changes" : "Submit qualification"}
        </Button>
        <button type="button" className="mt-2 min-h-11 w-full text-sm font-semibold" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}
