import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/Chrome";
import towingPhoto from "@/img/photo-towing.jpg";
import lockoutPhoto from "@/img/photo-lockout.jpg";
import jumpPhoto from "@/img/photo-jump.jpg";
import fuelPhoto from "@/img/photo-fuel.jpg";
import collectionPhoto from "@/img/photo-collection.jpg";
import dnaPhoto from "@/img/photo-dna.jpg";
import docsPhoto from "@/img/photo-docs.jpg";
import notaryPhoto from "@/img/photo-notary.jpg";
import { Button } from "@/components/kit";
import {
  DNA_LAB_DISCLOSURE,
  LAB_DISCLOSURE,
  PATENT_FOOTNOTE,
  getService,
} from "@/lib/content";
import { useApp } from "@/lib/store";

const SERVICE_PHOTOS: Record<string, string> = {
  towing: towingPhoto,
  lockouts: lockoutPhoto,
  "jump-starts": jumpPhoto,
  "fuel-delivery": fuelPhoto,
  "drug-alcohol": collectionPhoto,
  dna: dnaPhoto,
  "pim-vee": docsPhoto,
  notary: notaryPhoto,
};

export const Route = createFileRoute("/_app/services/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `SIH&S — ${getService(params.slug)?.title ?? "Service"}` }],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const service = getService(slug);
  const navigate = useNavigate();
  const { setDraft } = useApp();

  if (!service) {
    return (
      <div>
        <ScreenHeader title="Service" />
        <p className="px-4">That service is not available.</p>
      </div>
    );
  }

  const start = (locationType?: "in-office" | "mobile") => {
    setDraft({ serviceSlug: service.slug, locationType });
    navigate({ to: "/request", search: { slug: service.slug } });
  };

  return (
    <div className="pb-8">
      <ScreenHeader title="SIH&S" />
      <img
        src={SERVICE_PHOTOS[service.slug]}
        alt={service.title}
        className="h-52 w-full object-cover"
      />
      <div className="px-4 pt-4">
        <h2 className="text-2xl font-semibold">{service.title}</h2>
        {service.slug === "pim-vee" && (
          <p className="mt-2 text-sm leading-relaxed">
            PIM-VEE™ (Post-Incident Motor Vehicle Coordination & Documentation Services — &quot;PIMVCDS&quot;)
          </p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">{service.descriptor}</p>
        {service.slug === "towing" && (
          <p className="mt-3 inline-flex rounded-md bg-[#5fbb3f] px-2 py-1 text-xs font-semibold text-[#001e16]">
            PRIMARY SERVICE AREA: Northern New Castle County, DE
          </p>
        )}
        {service.slug === "pim-vee" && (
          <p className="mt-3 text-sm font-semibold">
            Employer-Directed | Non-Investigative | No Scene Control | No Evidence Handling
          </p>
        )}

        <h3 className="mb-1 mt-5 text-sm font-semibold uppercase tracking-wide">Description</h3>
        <p className="text-sm leading-relaxed">{service.description}</p>

        {(service.slug === "drug-alcohol" || service.slug === "dna") && (
          <p className="mt-4 rounded-md border border-border bg-card p-3 text-sm leading-relaxed">
            {LAB_DISCLOSURE}
            {service.slug === "dna" && <span className="mt-2 block">{DNA_LAB_DISCLOSURE}</span>}
          </p>
        )}

        <h3 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wide">Included Services</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          {service.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {service.slug === "towing" && (
          <div className="mt-4 rounded-md border border-border bg-card p-3 text-sm leading-relaxed">
            <p className="font-semibold">HOOK & TEST™ — U.S. Patent Pending</p>
            <p className="mt-2">
              Integrated towing with urine specimen collection and breath-alcohol testing, when each service is separately
              confirmed.
            </p>
            <p className="mt-3 font-semibold">HOOK & PIM-VEE™ — U.S. Patent Pending</p>
            <p className="mt-2">Integrated towing with PIM-VEE™ documentation, when each service is separately confirmed.</p>
            <p className="mt-3 text-xs text-muted-foreground">{PATENT_FOOTNOTE}</p>
          </div>
        )}

        <p className="mt-4 text-sm font-semibold text-accent-text">{service.pricing}</p>

        <div className="mt-5 space-y-3">
          {service.kind === "dispatch" ? (
            <Button type="button" full onClick={() => start()}>
              Request Dispatch
            </Button>
          ) : service.slug === "drug-alcohol" || service.slug === "dna" ? (
            <>
              <Button type="button" full onClick={() => start("mobile")}>
                Request mobile collection
              </Button>
              <Button type="button" variant="outline" full onClick={() => start("in-office")}>
                Request in-office appointment
              </Button>
            </>
          ) : (
            <Button type="button" full onClick={() => start()}>
              Request appointment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
