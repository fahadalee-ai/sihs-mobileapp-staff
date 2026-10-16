import { createFileRoute } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/Chrome";
import { CUSTOMER_CONFIG } from "@/lib/customer-config";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({ meta: [{ title: "SIH&S — Documents" }] }),
  component: Documents,
});

function Documents() {
  return (
    <div>
      <ScreenHeader title="Documents" backTo="/profile" />
      <div className="space-y-3 px-4 pb-8">
        <p className="text-sm text-muted-foreground">
          Only documents SIH&S marks customer-visible appear here ({CUSTOMER_CONFIG.documentCategories.join(", ")}). Testing, DNA, medical, claim, and investigation files are not listed.
        </p>
        <p className="rounded-[16px] border border-dashed border-white/20 bg-[#06281f] p-4 text-sm text-[#f4f7f5]">
          No customer-visible documents yet.
        </p>
      </div>
    </div>
  );
}
