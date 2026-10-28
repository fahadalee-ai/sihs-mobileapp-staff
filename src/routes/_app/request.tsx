import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ImagePlus, Video } from "lucide-react";
import { useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { z } from "zod";
import { Art } from "@/components/Art";
import { ScreenHeader } from "@/components/Chrome";
import { Button, Field, Input, Select, Textarea } from "@/components/kit";
import { RESTRICTED_MEDIA_SLUGS, CUSTOMER_CONFIG } from "@/lib/customer-config";
import { LAB_DISCLOSURE, PRICING_APPOINTMENT, PRICING_DISPATCH, SERVICES, SMS_CONSENT, getService } from "@/lib/content";
import { useApp } from "@/lib/store";
import { VEHICLE_COLORS, VEHICLE_MAKES, VEHICLE_YEARS, modelsForMake } from "@/lib/vehicles";

const searchSchema = z.object({ slug: z.string().catch("") });

const EXTRA_SERVICES = [
  { slug: "lawncare", title: "Lawncare" },
  { slug: "janitorial", title: "Janitorial" },
  { slug: "courier", title: "Courier or Product Delivery" },
  { slug: "transport", title: "Employee Transportation" },
  { slug: "supplies", title: "Supplies or Products" },
  { slug: "other", title: "Other / Not listed" },
];

const VEHICLE_SLUGS = new Set(["towing", "lockouts", "jump-starts", "fuel-delivery"]);
const APPOINTMENT_SLUGS = new Set(["dna", "drug-alcohol", "notary"]);
const SLOTS = ["Tue 9:00 AM", "Tue 1:00 PM", "Wed 10:30 AM", "Thu 3:00 PM"];

type UploadItem = {
  id: string;
  name: string;
  kind: "photo" | "video";
  status: "Uploading" | "Received" | "Failed";
  progress: number;
  preview: string;
  note?: string;
};

export const Route = createFileRoute("/_app/request")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "SIH&S — Request" }] }),
  component: RequestScreen,
});

function serviceTitle(slug: string) {
  return getService(slug)?.title ?? EXTRA_SERVICES.find((item) => item.slug === slug)?.title ?? "Other / Not listed";
}

function RequestScreen() {
  const { slug } = Route.useSearch();
  const { user, guest, locations, submitRequest } = useApp();
  const navigate = useNavigate();
  const signedIn = Boolean(user) && !guest;
  const [step, setStep] = useState(0);
  const [serviceSlug, setServiceSlug] = useState(slug || "towing");
  const [otherText, setOtherText] = useState("");
  const [name, setName] = useState(signedIn ? user?.fullName ?? "" : "");
  const [callback, setCallback] = useState(signedIn ? user?.phone ?? "" : "");
  const [organization, setOrganization] = useState(
    signedIn && user?.organizationAccess === "linked" ? user.organization ?? "Individual / not linked" : "Individual / not linked",
  );
  const [po, setPo] = useState("");
  const [scope, setScope] = useState("");
  const [timing, setTiming] = useState("As soon as possible");
  const [windowText, setWindowText] = useState("");
  const [propertyAddress, setPropertyAddress] = useState(signedIn ? user?.address ?? "" : "");
  const [serviceLocation, setServiceLocation] = useState("");
  const [accessNotes, setAccessNotes] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [outside, setOutside] = useState(false);
  const [askLocation, setAskLocation] = useState(false);
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [plate, setPlate] = useState("");
  const [condition, setCondition] = useState("");
  const [authority, setAuthority] = useState("");
  const [privateProperty, setPrivateProperty] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [ownerContact, setOwnerContact] = useState("");
  const [authorization, setAuthorization] = useState("");
  const [destination, setDestination] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [program, setProgram] = useState("");
  const [participants, setParticipants] = useState("");
  const [recipients, setRecipients] = useState("");
  const [laboratory, setLaboratory] = useState("");
  const [documents, setDocuments] = useState("");
  const [category, setCategory] = useState("");
  const [pickup, setPickup] = useState("");
  const [testingStop, setTestingStop] = useState("");
  const [returnStop, setReturnStop] = useState("");
  const [passengers, setPassengers] = useState("");
  const [areas, setAreas] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [noPhoto, setNoPhoto] = useState("");
  const [items, setItems] = useState("");
  const [substitutions, setSubstitutions] = useState("No");
  const [incidentWhen, setIncidentWhen] = useState("");
  const [incidentWhere, setIncidentWhere] = useState("");
  const [vehicles, setVehicles] = useState("");
  const [onScene, setOnScene] = useState("");
  const [terms, setTerms] = useState(false);
  const [sms, setSms] = useState(false);
  const [duplicateId, setDuplicateId] = useState("");
  const [stepError, setStepError] = useState("");
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null);
  const [otherAddress, setOtherAddress] = useState("");
  const [hoodNotes, setHoodNotes] = useState("");
  const [pickupWhen, setPickupWhen] = useState("");
  const [destWhen, setDestWhen] = useState("");
  const [returnWhen, setReturnWhen] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [slot, setSlot] = useState("");

  const hideMedia = RESTRICTED_MEDIA_SLUGS.has(serviceSlug);
  const steps = useMemo(
    () => ["Service", "Requester", "What you need", "Where", ...(hideMedia ? [] : ["Photos"]), "Details", "Review"],
    [hideMedia],
  );
  const title = serviceTitle(serviceSlug);
  const orgLabel = signedIn
    ? user?.organizationAccess === "linked"
      ? user?.organization || "Individual / not linked"
      : "Individual / not linked"
    : organization;
  const preferred = timing === "Specific date and time window" ? windowText || "Specific window" : timing;
  const inDelaware = /delaware|\bde\b|wilmington|new castle/i.test(`${propertyAddress} ${serviceLocation}`);

  const next = () => {
    setStepError("");
    if (steps[step] === "Service" && serviceSlug === "other" && !otherText.trim()) {
      setStepError("Describe the service or item.");
      return;
    }
    if (steps[step] === "Requester" && callback.replace(/\D/g, "").length < 10) {
      setStepError("Enter a 10-digit callback number.");
      return;
    }
    if (steps[step] === "Details" && VEHICLE_SLUGS.has(serviceSlug) && !authority) {
      setStepError("Choose who has authority to request this service.");
      return;
    }
    if (
      steps[step] === "Details" &&
      serviceSlug === "towing" &&
      privateProperty &&
      (!ownerName.trim() || !ownerContact.trim() || !authorization.trim())
    ) {
      setStepError("Private-property towing needs the owner or manager name, contact, and an authorization upload or description.");
      return;
    }
    setStep((value) => Math.min(value + 1, steps.length - 1));
  };

  const submit = () => {
    if (!signedIn) return;
    const offline = typeof navigator !== "undefined" && !navigator.onLine;
    const result = submitRequest({
      serviceSlug,
      serviceTitle: title,
      callback: callback.trim(),
      requesterName: (signedIn ? user?.fullName ?? "" : name).trim(),
      organizationLabel: orgLabel.trim(),
      poNumber: po.trim(),
      propertyAddress: propertyAddress.trim(),
      pickupLocation: serviceLocation.trim(),
      serviceEntrance: accessNotes.trim(),
      description: scope.trim() || otherText.trim(),
      photoCount: files.filter((item) => item.status !== "Failed").length,
      vehicleSummary: VEHICLE_SLUGS.has(serviceSlug) ? [year, make, model, color, plate].filter(Boolean).join(" · ") : undefined,
      detailSummary: [authority, fuelType, destination, program, category, items, hoodNotes, pickupWhen, destWhen, returnWhen, recurring ? "Recurring requested" : ""].filter(Boolean).join(" · "),
      when: preferred,
      authorizationPending: serviceSlug === "towing" && privateProperty,
      requestType: EXTRA_SERVICES.some((item) => item.slug === serviceSlug) ? "unlisted" : "listed",
      vehicle: VEHICLE_SLUGS.has(serviceSlug) ? { make, model, year, color, plate, notes: condition } : undefined,
      offline,
      mediaPending: files.some((item) => item.status === "Uploading" || item.status === "Failed"),
    });
    if (result.duplicate) {
      setDuplicateId(result.id);
      return;
    }
    navigate({ to: "/confirmation", search: { id: result.id } });
  };

  return (
    <div>
      <ScreenHeader title="Request" backTo="/home" />
      <div className="px-4 pb-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button type="button" className="min-h-11 text-sm font-semibold text-accent-text" onClick={() => (step === 0 ? navigate({ to: "/home" }) : setStep((value) => value - 1))}>
            Back
          </button>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Step {step + 1} of {steps.length} · {steps[step]}
          </p>
        </div>
        <div className="mb-4 h-1 overflow-hidden rounded-full bg-card">
          <div className="h-full bg-[#5fbb3f]" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>

        {steps[step] === "Service" && (
          <>
            <Field label="Service">
              <select className="min-h-11 w-full rounded-xl border border-border bg-card px-3" value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)}>
                {SERVICES.map((service) => (
                  <option key={service.slug} value={service.slug}>{service.title}</option>
                ))}
                {EXTRA_SERVICES.map((service) => (
                  <option key={service.slug} value={service.slug}>{service.title}</option>
                ))}
              </select>
            </Field>
            {serviceSlug === "other" && (
              <Field label="Describe the service or item">
                <Textarea value={otherText} onChange={(e) => setOtherText(e.target.value)} />
              </Field>
            )}
          </>
        )}

        {steps[step] === "Requester" && (
          <>
            {!signedIn && (
              <p className="mb-3 text-sm text-[#c5d4cc]">
                Guests can review a request. Create an account before submitting it.
              </p>
            )}
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Callback Number" error={stepError && steps[step] === "Requester" ? stepError : undefined}>
              <Input inputMode="tel" value={callback} onChange={(e) => setCallback(e.target.value)} placeholder="(302) 000-0000" autoComplete="tel" required />
            </Field>
            <p className="mb-4 text-sm text-[#c5d4cc]">
              {SMS_CONSENT}{" "}
              <Link to="/legal/$doc" params={{ doc: "privacy" }} className="font-semibold text-[#8fd86f] underline">
                SMS consent
              </Link>
            </p>
            <Field label="Organization / Property">
              <select className="min-h-11 w-full rounded-xl border border-border bg-card px-3" value={organization} onChange={(e) => setOrganization(e.target.value)}>
                <option>Individual / not linked</option>
                {signedIn && user?.organizationAccess === "linked" && user.organization && (
                  <option>{user.organization}</option>
                )}
                {signedIn &&
                  locations.map((place) => (
                    <option key={place.id} value={`${place.label} — ${place.line}`}>
                      {place.label} — {place.line}
                    </option>
                  ))}
              </select>
            </Field>
            {signedIn && organization !== "Individual / not linked" && (
              <Field label="Purchase Order Number">
                <Input value={po} onChange={(e) => setPo(e.target.value)} />
              </Field>
            )}
          </>
        )}

        {steps[step] === "What you need" && (
          <>
            <Field label="Requested work or items">
              <Textarea value={scope} onChange={(e) => setScope(e.target.value)} />
            </Field>
            <Field label="Preferred timing">
              <select className="min-h-11 w-full rounded-xl border border-border bg-card px-3" value={timing} onChange={(e) => setTiming(e.target.value)}>
                <option>As soon as possible</option>
                <option>Specific date and time window</option>
                <option>Flexible</option>
              </select>
            </Field>
            {timing === "Specific date and time window" && (
              <Field label="Date and time window">
                <Input type="datetime-local" value={windowText} onChange={(e) => setWindowText(e.target.value)} />
              </Field>
            )}
            {APPOINTMENT_SLUGS.has(serviceSlug) && (
              <fieldset className="mt-4 rounded-md border border-border bg-card p-3">
                <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preferred appointment time</legend>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Powered by Square</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {SLOTS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`min-h-11 rounded-md px-2 text-sm font-semibold ${slot === item ? "bg-[#5fbb3f] text-[#001e16]" : "border border-border"}`}
                      onClick={() => {
                        setSlot(item);
                        setTiming("Specific date and time window");
                        setWindowText(item);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">The selected slot is a preferred time. It is pending SIH&S confirmation.</p>
              </fieldset>
            )}
            <p className="text-sm text-muted-foreground">Preferred timing is a request, not a confirmed time.</p>
          </>
        )}

        {steps[step] === "Where" && (
          <>
            <h2 className="mb-2 text-base font-semibold">Where should we go</h2>
            {signedIn && locations.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {locations.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    className="min-h-11 rounded-md border border-white/15 bg-[#06281f] px-3 text-sm font-semibold"
                    onClick={() => {
                      setPropertyAddress(place.line);
                      setServiceLocation(place.entrance || place.pickup || "");
                      setOutside(place.line.trim().length > 8 && !/delaware|\bde\b|wilmington|new castle/i.test(place.line));
                    }}
                  >
                    {place.label}
                  </button>
                ))}
              </div>
            )}
            <Button type="button" variant="outline" className="mb-3" onClick={() => setAskLocation(true)}>
              Use My Location
            </Button>
            {askLocation && (
              <div className="mb-4 rounded-md border border-border bg-card p-3 text-sm">
                <p>SIH&S uses this only to place a pin you can move. You can deny permission and type an address instead. The system prompt appears after you continue.</p>
                <Button
                  type="button"
                  className="mt-3"
                  onClick={() => {
                    setAskLocation(false);
                    if (!navigator.geolocation) {
                      setAccuracy("Location permission denied. Enter an address instead.");
                      return;
                    }
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setPin({ x: 180, y: 96 });
                        setAccuracy(pos.coords.accuracy > 80 ? "Location accuracy is low. Please confirm the pin." : "");
                      },
                      () => setAccuracy("Location permission denied. Enter an address instead."),
                    );
                  }}
                >
                  Continue
                </Button>
                <button
                  type="button"
                  className="mt-2 min-h-11 text-sm font-semibold underline"
                  onClick={() => {
                    setAskLocation(false);
                    setAccuracy("Location permission denied. Enter an address instead.");
                  }}
                >
                  Enter an address instead
                </button>
              </div>
            )}
            {pin && <PinMap placed={pin} onPlace={setPin} />}
            <Field label="Enter another address">
              <Input
                value={otherAddress}
                onChange={(e) => {
                  setOtherAddress(e.target.value);
                  if (!pin) setPin({ x: 140, y: 80 });
                }}
                placeholder="Street address if the pin is not the service spot"
              />
            </Field>
            {accuracy && (
              <p className="mb-3 rounded-md border border-border bg-card p-3 text-sm" role="status">
                {accuracy}
              </p>
            )}
            <Field label="Property address">
              <Input value={propertyAddress} onChange={(e) => { setPropertyAddress(e.target.value); setOutside(e.target.value.trim().length > 8 && !/delaware|\bde\b|wilmington|new castle/i.test(e.target.value)); }} placeholder="Street address in Delaware" />
            </Field>
            <Field label="Actual service location">
              <Input value={serviceLocation} onChange={(e) => setServiceLocation(e.target.value)} placeholder="Service entrance, pickup point, or vehicle location" />
            </Field>
            <Field label="Access instructions">
              <Textarea value={accessNotes} onChange={(e) => setAccessNotes(e.target.value)} />
            </Field>
            {(outside || (propertyAddress.trim().length > 8 && !inDelaware)) && (
              <p className="mb-3 rounded-md border border-border bg-card p-3 text-sm">This location may be outside our Primary Service Area. SIH&S will review your request.</p>
            )}
            {serviceSlug === "towing" && (
              <p className="text-sm text-muted-foreground">SIH&S provides Delaware intrastate towing only. Interstate movements are coordinated through properly authorized carriers.</p>
            )}
          </>
        )}

        {steps[step] === "Photos" && <MediaPicker items={files} onChange={setFiles} />}

        {steps[step] === "Details" && hideMedia && (
          <p className="mb-4 rounded-md border border-border bg-card p-3 text-sm">Do not enter medical or sensitive health information in this request.</p>
        )}

        {steps[step] === "Details" && (
          <ServiceDetails
            slug={serviceSlug}
            make={make} setMake={setMake}
            model={model} setModel={setModel}
            year={year} setYear={setYear}
            color={color} setColor={setColor}
            plate={plate} setPlate={setPlate}
            condition={condition} setCondition={setCondition}
            authority={authority} setAuthority={setAuthority}
            privateProperty={privateProperty} setPrivateProperty={setPrivateProperty}
            ownerName={ownerName} setOwnerName={setOwnerName}
            ownerContact={ownerContact} setOwnerContact={setOwnerContact}
            authorization={authorization} setAuthorization={setAuthorization}
            destination={destination} setDestination={setDestination}
            fuelType={fuelType} setFuelType={setFuelType}
            program={program} setProgram={setProgram}
            participants={participants} setParticipants={setParticipants}
            recipients={recipients} setRecipients={setRecipients}
            laboratory={laboratory} setLaboratory={setLaboratory}
            documents={documents} setDocuments={setDocuments}
            category={category} setCategory={setCategory}
            pickup={pickup} setPickup={setPickup}
            testingStop={testingStop} setTestingStop={setTestingStop}
            returnStop={returnStop} setReturnStop={setReturnStop}
            passengers={passengers} setPassengers={setPassengers}
            areas={areas} setAreas={setAreas}
            exclusions={exclusions} setExclusions={setExclusions}
            noPhoto={noPhoto} setNoPhoto={setNoPhoto}
            items={items} setItems={setItems}
            substitutions={substitutions} setSubstitutions={setSubstitutions}
            incidentWhen={incidentWhen} setIncidentWhen={setIncidentWhen}
            incidentWhere={incidentWhere} setIncidentWhere={setIncidentWhere}
            vehicles={vehicles} setVehicles={setVehicles}
            onScene={onScene} setOnScene={setOnScene}
            hoodNotes={hoodNotes} setHoodNotes={setHoodNotes}
            pickupWhen={pickupWhen} setPickupWhen={setPickupWhen}
            destWhen={destWhen} setDestWhen={setDestWhen}
            returnWhen={returnWhen} setReturnWhen={setReturnWhen}
            recurring={recurring} setRecurring={setRecurring}
            error=""
          />
        )}

        {steps[step] === "Review" && (
          <>
            <article className="rounded-md border border-border bg-card p-3 text-sm">
              <p className="font-semibold">{title}</p>
              <p className="mt-1">{name} · {callback}</p>
              <p>{orgLabel}{po ? ` · PO ${po}` : ""}</p>
              <p className="mt-2">{scope || otherText || "No work description yet."}</p>
              <p>Preferred timing: {preferred}</p>
              <p>Property address: {propertyAddress || "Not entered"}</p>
              <p>Where the crew should go: {serviceLocation || "Not entered"}</p>
              <div className="mt-2 flex flex-wrap gap-x-4">
                <button type="button" className="min-h-11 font-semibold text-accent-text underline" onClick={() => setStep(steps.indexOf("Service"))}>Edit service</button>
                <button type="button" className="min-h-11 font-semibold text-accent-text underline" onClick={() => setStep(steps.indexOf("Requester"))}>Edit requester</button>
                <button type="button" className="min-h-11 font-semibold text-accent-text underline" onClick={() => setStep(steps.indexOf("Where"))}>Edit place</button>
                {!hideMedia && <button type="button" className="min-h-11 font-semibold text-accent-text underline" onClick={() => setStep(steps.indexOf("Photos"))}>Edit photos</button>}
                <button type="button" className="min-h-11 font-semibold text-accent-text underline" onClick={() => setStep(steps.indexOf("Details"))}>Edit details</button>
              </div>
            </article>
            <p className="mt-4 text-sm">{VEHICLE_SLUGS.has(serviceSlug) ? PRICING_DISPATCH : PRICING_APPOINTMENT}</p>
            {VEHICLE_SLUGS.has(serviceSlug) && <p className="mt-2 text-sm">Vehicle-only pricing; no passenger transport included.</p>}
            {VEHICLE_SLUGS.has(serviceSlug) && <p className="mt-2 text-sm">{[year, make, model, color, plate].filter(Boolean).join(" · ") || "No vehicle entered."}</p>}
            <p className="mt-2 text-sm">{files.filter((item) => item.status !== "Failed").length} photos or videos attached.</p>
            <label className="mt-4 flex items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1 h-5 w-5" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
              <span>Accept Service Terms — I have reviewed the <Link to="/legal/$doc" params={{ doc: "terms" }} className="font-semibold text-accent-text underline">Full Terms & Agreement</Link>.</span>
            </label>
            <label className="mt-4 flex items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1 h-5 w-5" checked={sms} onChange={(e) => setSms(e.target.checked)} />
              <span>
                {SMS_CONSENT}{" "}
                <Link to="/legal/$doc" params={{ doc: "privacy" }} className="font-semibold text-accent-text underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            <p className="mt-4 text-sm font-semibold">Submitting this request does not dispatch staff, confirm an appointment, approve a purchase, or authorize vehicle removal.</p>
            {duplicateId && (
              <p className="mt-3 text-sm">
                This request was already submitted.{" "}
                <Link to="/requests/$id" params={{ id: duplicateId }} className="font-semibold text-accent-text underline">View request {duplicateId}</Link>
              </p>
            )}
          </>
        )}

        {stepError && steps[step] !== "Requester" && (
          <p className="mt-3 text-sm font-medium text-danger" role="alert">{stepError}</p>
        )}
        {steps[step] !== "Review" ? (
          <Button type="button" full className="mt-4" onClick={next}>Continue</Button>
        ) : !signedIn ? (
          <div className="mt-4">
            <p className="mb-3 text-sm">Create an account before submitting a request. Guests can still call SIH&S.</p>
            <Button type="button" full onClick={() => navigate({ to: "/signup" })}>Create an account</Button>
          </div>
        ) : (
          <Button type="button" full className="mt-4" disabled={!terms || !sms} onClick={submit}>Submit Request</Button>
        )}
      </div>
    </div>
  );
}

function PinMap({
  placed,
  onPlace,
}: {
  placed: { x: number; y: number };
  onPlace: (point: { x: number; y: number }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (clientX: number, clientY: number) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    onPlace({
      x: Math.min(Math.max(clientX - box.left, 12), box.width - 12),
      y: Math.min(Math.max(clientY - box.top, 16), box.height - 8),
    });
  };
  return (
    <div
      ref={ref}
      className="relative mb-3 h-48 touch-none overflow-hidden rounded-md border border-border bg-[#0c3328]"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        move(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (event.buttons !== 1) return;
        move(event.clientX, event.clientY);
      }}
    >
      <Art kind="map" className="pointer-events-none h-full w-full" />
      <span
        className="absolute h-4 w-4 -translate-x-1/2 -translate-y-full rounded-full border-2 border-[#001e16] bg-[#5fbb3f]"
        style={{ left: placed.x, top: placed.y }}
        aria-hidden
      />
      <p className="sr-only">Map with a draggable pin. Press and drag to confirm the service location.</p>
    </div>
  );
}

function videoDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = video.duration;
      URL.revokeObjectURL(url);
      resolve(duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable"));
    };
    video.src = url;
  });
}

function MediaPicker({ items, onChange }: { items: UploadItem[]; onChange: Dispatch<SetStateAction<UploadItem[]>> }) {
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const maxSeconds = CUSTOMER_CONFIG.videoMaxSeconds;

  const finish = (id: string) => {
    window.setTimeout(() => {
      onChange((current) => current.map((item) => (item.id === id ? { ...item, status: "Received", progress: 100 } : item)));
    }, 700);
  };

  const addFiles = async (list: FileList | null, kind: "photo" | "video") => {
    const incoming = Array.from(list ?? []);
    if (!incoming.length) return;
    const created: UploadItem[] = [];
    for (const file of incoming) {
      const id = `${kind}-${file.name}-${Date.now()}-${created.length}`;
      let note: string | undefined;
      let failed = false;
      if (kind === "video") {
        try {
          const duration = await videoDuration(file);
          if (duration > maxSeconds) {
            failed = true;
            note = `Longer than ${maxSeconds} seconds.`;
          }
        } catch {
          failed = true;
          note = "This clip could not be read.";
        }
      }
      created.push({
        id,
        name: file.name,
        kind,
        status: failed ? "Failed" : "Uploading",
        progress: failed ? 0 : 45,
        preview: URL.createObjectURL(file),
        note,
      });
      if (!failed) finish(id);
    }
    onChange((current) => [...current, ...created]);
  };

  const remove = (id: string) => {
    const found = items.find((item) => item.id === id);
    if (found) URL.revokeObjectURL(found.preview);
    onChange((current) => current.filter((item) => item.id !== id));
  };

  const retry = (id: string) => {
    onChange((current) => current.map((item) => (item.id === id ? { ...item, status: "Uploading", progress: 45, note: undefined } : item)));
    finish(id);
  };

  const photos = items.filter((item) => item.kind === "photo").length;
  const videos = items.filter((item) => item.kind === "video").length;

  return (
    <div>
      <p className="text-sm text-[#c5d4cc]">
        Add more than one photo, or short clips up to {maxSeconds} seconds. This step is optional. The request can still be received while files upload.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => photoRef.current?.click()}
          className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-[16px] border border-white/15 bg-[#06281f] px-3 text-center"
        >
          <ImagePlus size={22} className="text-[#8fd86f]" aria-hidden />
          <span className="text-sm font-semibold text-[#f4f7f5]">Add photos</span>
          <span className="text-xs text-[#c5d4cc]">Camera or library</span>
        </button>
        <button
          type="button"
          onClick={() => videoRef.current?.click()}
          className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-[16px] border border-white/15 bg-[#06281f] px-3 text-center"
        >
          <Video size={22} className="text-[#8fd86f]" aria-hidden />
          <span className="text-sm font-semibold text-[#f4f7f5]">Add video</span>
          <span className="text-xs text-[#c5d4cc]">Up to {maxSeconds} seconds</span>
        </button>
      </div>
      <input
        ref={photoRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          void addFiles(e.target.files, "photo");
          e.target.value = "";
        }}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          void addFiles(e.target.files, "video");
          e.target.value = "";
        }}
      />
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#c5d4cc]">
        {items.length === 0 ? "No files yet" : `${photos} photo${photos === 1 ? "" : "s"} · ${videos} video${videos === 1 ? "" : "s"}`}
      </p>
      {items.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3">
          {items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-[16px] border border-white/15 bg-[#06281f]">
              {item.kind === "photo" ? (
                <img src={item.preview} alt="" className="h-28 w-full object-cover" />
              ) : (
                <video src={item.preview} className="h-28 w-full bg-[#0c3328] object-cover" muted playsInline />
              )}
              <div className="p-2">
                <p className="truncate text-xs font-semibold text-[#f4f7f5]">{item.name}</p>
                <p className="text-[11px] uppercase tracking-wide text-[#8fd86f]">{item.kind}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#0c3328]" aria-hidden>
                  <div className="h-full bg-[#5fbb3f]" style={{ width: `${item.progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-[#c5d4cc]">{item.note ?? item.status}</p>
                <div className="mt-1 flex gap-3">
                  {item.status === "Failed" && !item.note && (
                    <button type="button" className="min-h-11 text-xs font-semibold text-[#8fd86f]" onClick={() => retry(item.id)}>
                      Retry
                    </button>
                  )}
                  <button type="button" className="min-h-11 text-xs font-semibold text-[#f4f7f5]" onClick={() => remove(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ServiceDetails(props: {
  slug: string;
  make: string; setMake: (value: string) => void;
  model: string; setModel: (value: string) => void;
  year: string; setYear: (value: string) => void;
  color: string; setColor: (value: string) => void;
  plate: string; setPlate: (value: string) => void;
  condition: string; setCondition: (value: string) => void;
  authority: string; setAuthority: (value: string) => void;
  privateProperty: boolean; setPrivateProperty: (value: boolean) => void;
  ownerName: string; setOwnerName: (value: string) => void;
  ownerContact: string; setOwnerContact: (value: string) => void;
  authorization: string; setAuthorization: (value: string) => void;
  destination: string; setDestination: (value: string) => void;
  fuelType: string; setFuelType: (value: string) => void;
  program: string; setProgram: (value: string) => void;
  participants: string; setParticipants: (value: string) => void;
  recipients: string; setRecipients: (value: string) => void;
  laboratory: string; setLaboratory: (value: string) => void;
  documents: string; setDocuments: (value: string) => void;
  category: string; setCategory: (value: string) => void;
  pickup: string; setPickup: (value: string) => void;
  testingStop: string; setTestingStop: (value: string) => void;
  returnStop: string; setReturnStop: (value: string) => void;
  passengers: string; setPassengers: (value: string) => void;
  areas: string; setAreas: (value: string) => void;
  exclusions: string; setExclusions: (value: string) => void;
  noPhoto: string; setNoPhoto: (value: string) => void;
  items: string; setItems: (value: string) => void;
  substitutions: string; setSubstitutions: (value: string) => void;
  incidentWhen: string; setIncidentWhen: (value: string) => void;
  incidentWhere: string; setIncidentWhere: (value: string) => void;
  vehicles: string; setVehicles: (value: string) => void;
  onScene: string; setOnScene: (value: string) => void;
  hoodNotes: string; setHoodNotes: (value: string) => void;
  pickupWhen: string; setPickupWhen: (value: string) => void;
  destWhen: string; setDestWhen: (value: string) => void;
  returnWhen: string; setReturnWhen: (value: string) => void;
  recurring: boolean; setRecurring: (value: boolean) => void;
  error: string;
}) {
  if (VEHICLE_SLUGS.has(props.slug)) {
    return (
      <>
        <Field label="Make">
          <Select
            value={props.make}
            onChange={(e) => {
              const next = e.target.value;
              props.setMake(next);
              if (!modelsForMake(next).includes(props.model)) props.setModel("");
            }}
          >
            <option value="">Select make</option>
            {VEHICLE_MAKES.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </Select>
        </Field>
        <Field label="Model">
          <Select
            value={props.model}
            disabled={!props.make}
            onChange={(e) => props.setModel(e.target.value)}
          >
            <option value="">{props.make ? "Select model" : "Select a make first"}</option>
            {modelsForMake(props.make).map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </Select>
        </Field>
        <Field label="Year">
          <Select value={props.year} onChange={(e) => props.setYear(e.target.value)}>
            <option value="">Select year</option>
            {VEHICLE_YEARS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
        </Field>
        <Field label="Color">
          <Select value={props.color} onChange={(e) => props.setColor(e.target.value)}>
            <option value="">Select color</option>
            {VEHICLE_COLORS.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </Select>
        </Field>
        <Field label="License plate (optional)"><Input value={props.plate} onChange={(e) => props.setPlate(e.target.value)} /></Field>
        <Field label="Vehicle condition notes"><Textarea value={props.condition} onChange={(e) => props.setCondition(e.target.value)} placeholder="Missing wheels, steering problems, blocked location, travel lane, or shoulder" /></Field>
        <fieldset className="mb-4">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Authority to request</legend>
          {["Registered owner", "Authorized agent of the owner", "Property owner or manager requesting removal"].map((item) => (
            <label key={item} className="mb-2 flex items-start gap-3 text-sm">
              <input type="radio" name="authority" className="mt-1" checked={props.authority === item} onChange={() => props.setAuthority(item)} />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>
        {props.error && <p className="mb-3 text-sm font-medium text-danger">{props.error}</p>}
        {props.slug === "towing" && (
          <>
            <label className="mb-3 flex items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1 h-5 w-5" checked={props.privateProperty} onChange={(e) => props.setPrivateProperty(e.target.checked)} />
              <span>The vehicle is on private property.</span>
            </label>
            {props.privateProperty && (
              <div className="mb-4 rounded-md border border-border bg-card p-3">
                <p className="text-sm font-semibold">{CUSTOMER_CONFIG.towingAuthMessage}</p>
                <Field label="Property owner or manager name"><Input value={props.ownerName} onChange={(e) => props.setOwnerName(e.target.value)} /></Field>
                <Field label="Contact"><Input value={props.ownerContact} onChange={(e) => props.setOwnerContact(e.target.value)} /></Field>
                <Field label="Authorization upload or description">
                  <input
                    type="file"
                    className="mb-2 block w-full text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) props.setAuthorization(file.name);
                    }}
                  />
                  <Textarea value={props.authorization} onChange={(e) => props.setAuthorization(e.target.value)} placeholder="Or describe the authorization" />
                </Field>
              </div>
            )}
            <Field label="Destination"><Input value={props.destination} onChange={(e) => props.setDestination(e.target.value)} /></Field>
          </>
        )}
        {props.slug === "jump-starts" && (
          <Field label="Battery or hood access notes">
            <Textarea value={props.hoodNotes} onChange={(e) => props.setHoodNotes(e.target.value)} />
          </Field>
        )}
        {props.slug === "fuel-delivery" && (
          <Field label="Fuel type and quantity needed"><Input value={props.fuelType} onChange={(e) => props.setFuelType(e.target.value)} /></Field>
        )}
        <p className="text-sm">{PRICING_DISPATCH} Vehicle-only pricing; no passenger transport included.</p>
      </>
    );
  }
  if (props.slug === "transport") {
    return (
      <>
        <Field label="Pickup"><Input value={props.pickup} onChange={(e) => props.setPickup(e.target.value)} /></Field>
        <Field label="Testing or destination location"><Input value={props.testingStop} onChange={(e) => props.setTestingStop(e.target.value)} /></Field>
        <Field label="Return location"><Input value={props.returnStop} onChange={(e) => props.setReturnStop(e.target.value)} /></Field>
        <Field label="Passenger name(s)"><Textarea value={props.passengers} onChange={(e) => props.setPassengers(e.target.value)} /></Field>
        <p className="mb-3 text-sm text-muted-foreground">Passengers are client employees, not SIH&S staff.</p>
        <Field label="Preferred time, pickup"><Input value={props.pickupWhen} onChange={(e) => props.setPickupWhen(e.target.value)} /></Field>
        <Field label="Preferred time, testing or destination"><Input value={props.destWhen} onChange={(e) => props.setDestWhen(e.target.value)} /></Field>
        <Field label="Preferred time, return"><Input value={props.returnWhen} onChange={(e) => props.setReturnWhen(e.target.value)} /></Field>
      </>
    );
  }
  if (props.slug === "drug-alcohol" || props.slug === "dna") {
    return (
      <>
        <Field label="Program or test type"><Input value={props.program} onChange={(e) => props.setProgram(e.target.value)} placeholder="DOT, non-DOT, or DNA collection type" /></Field>
        <Field label="Participants"><Textarea value={props.participants} onChange={(e) => props.setParticipants(e.target.value)} placeholder="Name and contact for each person" /></Field>
        <Field label="Authorized recipients"><Textarea value={props.recipients} onChange={(e) => props.setRecipients(e.target.value)} /></Field>
        <Field label="Designated laboratory (optional)"><Input value={props.laboratory} onChange={(e) => props.setLaboratory(e.target.value)} /></Field>
        <p className="text-sm">{LAB_DISCLOSURE}</p>
        <p className="mt-2 text-sm text-muted-foreground">Do not enter medical or sensitive health information in this request. Required official program forms are completed during the collection.</p>
      </>
    );
  }
  if (props.slug === "notary") {
    return (
      <>
        <Field label="Number of documents"><Input value={props.documents} onChange={(e) => props.setDocuments(e.target.value)} /></Field>
        <Field label="Document category"><Input value={props.category} onChange={(e) => props.setCategory(e.target.value)} /></Field>
        <p className="rounded-md border border-border bg-card p-3 text-sm">SIH&S provides Delaware mobile, in-person notary service only. Do not upload documents.</p>
        <p className="mt-2 text-sm text-muted-foreground">Do not enter medical or sensitive health information in this request.</p>
      </>
    );
  }
  if (props.slug === "lawncare" || props.slug === "janitorial") {
    return (
      <>
        <Field label="Areas to service"><Textarea value={props.areas} onChange={(e) => props.setAreas(e.target.value)} /></Field>
        <Field label="Exclusions"><Textarea value={props.exclusions} onChange={(e) => props.setExclusions(e.target.value)} /></Field>
        <Field label="No-photo areas"><Textarea value={props.noPhoto} onChange={(e) => props.setNoPhoto(e.target.value)} /></Field>
        <label className="mb-4 flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1 h-5 w-5" checked={props.recurring} onChange={(e) => props.setRecurring(e.target.checked)} />
          <span>Request a recurring schedule. SIH&S confirms each visit. This does not create a confirmed schedule.</span>
        </label>
      </>
    );
  }
  if (props.slug === "courier" || props.slug === "supplies") {
    return (
      <>
        <Field label="Item list"><Textarea value={props.items} onChange={(e) => props.setItems(e.target.value)} placeholder="Name, quantity, specifications" /></Field>
        <Field label="Substitutions allowed?">
          <select className="min-h-11 w-full rounded-xl border border-border bg-card px-3" value={props.substitutions} onChange={(e) => props.setSubstitutions(e.target.value)}>
            <option>No</option>
            <option>Yes with my approval</option>
          </select>
        </Field>
        <Field label="Pickup location"><Input value={props.pickup} onChange={(e) => props.setPickup(e.target.value)} /></Field>
        <Field label="Delivery location"><Input value={props.testingStop} onChange={(e) => props.setTestingStop(e.target.value)} /></Field>
        <Field label="Recipient name"><Input value={props.passengers} onChange={(e) => props.setPassengers(e.target.value)} /></Field>
      </>
    );
  }
  if (props.slug === "pim-vee") {
    return (
      <>
        <p className="mb-3 text-sm font-semibold">Employer-Directed | Non-Investigative | No Scene Control | No Evidence Handling</p>
        <Field label="Incident date and time"><Input value={props.incidentWhen} onChange={(e) => props.setIncidentWhen(e.target.value)} /></Field>
        <Field label="Incident location"><Input value={props.incidentWhere} onChange={(e) => props.setIncidentWhere(e.target.value)} /></Field>
        <Field label="Vehicle(s) involved"><Input value={props.vehicles} onChange={(e) => props.setVehicles(e.target.value)} /></Field>
        <Field label="On-scene contact"><Input value={props.onScene} onChange={(e) => props.setOnScene(e.target.value)} /></Field>
        <p className="text-sm">PIM-VEE™ provides neutral, factual documentation. It does not determine fault or investigate.</p>
      </>
    );
  }
  return <p className="text-sm text-muted-foreground">No extra questions for this service. Continue to review.</p>;
}
