export const PHONE_DISPLAY = "302-406-HOOK";
export const PHONE_TEL = "+13024064665";
export const HQ =
  "1201 N. Orange St., Suite 7724, Wilmington, DE 19801";
export const SERVICE_AREA = "Northern New Castle County, DE";
export const EMAIL = "sihs@susanshooks.com";

export const SMS_CONSENT =
  "By providing your phone number, you consent to receive service-related calls and text messages from SIH&S. Message and data rates may apply. Message frequency varies. Reply STOP to opt out. Reply HELP for assistance.";

export const PATENT_FOOTNOTE =
  "U.S. Patent Pending refers to pending U.S. patent application(s) related to integrated workflow controls and is not a guarantee of patent grant.";

export const LAB_DISCLOSURE =
  "SIH&S performs specimen collection only. Laboratory analysis and MRO review are conducted by accredited third parties.";

export const DNA_LAB_DISCLOSURE =
  "SIH&S performs specimen collection only. Laboratory analysis is conducted by accredited third parties.";

export const PRICING_DISPATCH =
  "Final price depends on location, access, and conditions; quote confirmed before dispatch.";

export const PRICING_APPOINTMENT =
  "All pricing confirmed prior to deposit. Deposit required before scheduling or dispatch.";

export const DEPOSIT_EARNED =
  "Deposit earned upon dispatch (non-refundable to the extent permitted by law).";

export const REFUND_LINE =
  "Refund eligibility is determined by SIH&S in accordance with the Full Terms & Agreement.";

export type ServiceKind = "dispatch" | "appointment";

export type Service = {
  slug: string;
  title: string;
  short: string;
  descriptor: string;
  kind: ServiceKind;
  description: string;
  included: string[];
  pricing: string;
  hero: "tow" | "lock" | "jump" | "fuel" | "vial" | "dna" | "docs" | "notary";
  prominent?: boolean;
};

export const SERVICES: Service[] = [
  {
    slug: "towing",
    title: "Delaware Intrastate Towing",
    short: "Towing",
    descriptor: "Light-duty vehicle towing inside Delaware.",
    kind: "dispatch",
    hero: "tow",
    description:
      "SIH&S provides qualifying light-duty towing, accident- and incident-related towing, and vehicle relocation. Each request remains subject to vehicle condition, location, access, roadway safety, availability, and final confirmation. Initial pricing and the required deposit are confirmed before dispatch for direct customer-pay calls. Additional charges may apply if the vehicle, pickup or destination, mileage, access, waiting time, tolls, service requirements, or actual conditions differ from the information provided. Third-party reimbursement is not guaranteed. Vehicle-only service — passenger transport is not offered.",
    included: [
      "PRIMARY SERVICE AREA: Northern New Castle County, DE",
      "Delaware intrastate towing only.",
      "Interstate movements coordinated through properly authorized carriers.",
      "Private-pay requests generally within an 18-mile radius of 1201 N. Orange St., Suite 7724, Wilmington, DE 19801.",
      "The headquarters address defines the advertised retail radius and is not automatically the truck’s dispatch origin.",
      "Vehicle-only pricing. No passenger transport.",
    ],
    pricing: PRICING_DISPATCH,
  },
  {
    slug: "lockouts",
    title: "Lockouts",
    short: "Lockouts",
    descriptor: "Vehicle lockout assistance in the service area.",
    kind: "dispatch",
    hero: "lock",
    description:
      "SIH&S provides vehicle lockout assistance for qualifying light-duty vehicles in the Northern New Castle County service area. Service is subject to vehicle condition, location, access, roadway safety, staffing, and final confirmation. This is vehicle access assistance only.",
    included: [
      "Northern New Castle County, Delaware service area.",
      "Delaware intrastate response only.",
      "Quote confirmed before dispatch.",
      "Vehicle-only service.",
    ],
    pricing: PRICING_DISPATCH,
  },
  {
    slug: "jump-starts",
    title: "Jump Starts",
    short: "Jump Starts",
    descriptor: "Jump-start assistance for a dead battery.",
    kind: "dispatch",
    hero: "jump",
    description:
      "SIH&S provides jump-start assistance for drivers who need help with a dead battery. Roadside requests are subject to location, access, vehicle condition, staffing, and final confirmation. Pricing and any required deposit are confirmed before dispatch.",
    included: [
      "Jump-start assistance for qualifying light-duty vehicles.",
      "Northern New Castle County, Delaware service area.",
      "Delaware intrastate response only.",
      "Availability depends on staffing, location, and dispatch capacity.",
    ],
    pricing: PRICING_DISPATCH,
  },
  {
    slug: "fuel-delivery",
    title: "Fuel Delivery",
    short: "Fuel Delivery",
    descriptor: "Emergency fuel delivery to your vehicle.",
    kind: "dispatch",
    hero: "fuel",
    description:
      "SIH&S provides emergency fuel delivery for drivers who need fuel at the vehicle. Requests are subject to location, access, roadway safety, product availability, staffing, and final confirmation. Pricing and any required deposit are confirmed before dispatch.",
    included: [
      "Fuel delivered to the vehicle location.",
      "Northern New Castle County, Delaware service area.",
      "Delaware intrastate response only.",
      "Quote confirmed before dispatch.",
    ],
    pricing: PRICING_DISPATCH,
  },
  {
    slug: "drug-alcohol",
    title: "Drug & Alcohol Collections",
    short: "Collections",
    descriptor: "DOT and non-DOT specimen collection.",
    kind: "appointment",
    hero: "vial",
    description:
      "SIH&S provides authorized DOT and non-DOT urine specimen collection and breath-alcohol testing. In-office services are provided by appointment. Mobile services are available by appointment, subject to availability. The employer, consortium/third-party administrator, agency, or requesting authority remains responsible for the correct test, reason, panel, authority, and program requirements. For DOT urine testing, HHS-certified laboratories perform analysis and confirmation testing, and qualified Medical Review Officers review results when applicable. SIH&S maintains chain-of-custody procedures for the collection it performs.",
    included: [
      "In-office collection by appointment.",
      "Mobile collection by appointment and availability.",
      "DOT and non-DOT urine specimen collection.",
      "Breath-alcohol screening and confirmation when required under the applicable program.",
      "No compliance guarantee is provided by SIH&S.",
      "Complimentary parking vouchers may be available for up to one hour for confirmed in-office appointments, subject to availability.",
    ],
    pricing: PRICING_APPOINTMENT,
  },
  {
    slug: "dna",
    title: "DNA Services",
    short: "DNA Services",
    descriptor: "Legal and non-legal DNA specimen collection.",
    kind: "appointment",
    hero: "dna",
    prominent: true,
    description:
      "SIH&S provides legal and non-legal DNA specimen collection using documented identity-verification and chain-of-custody procedures. Collection types may include paternity, grandparent, siblingship, avuncular, and immigration, subject to laboratory and case requirements. These collection types are informational only and are not a guarantee of laboratory or agency acceptance. The designated third-party laboratory performs analysis. Accreditation, documentation, and acceptance requirements depend on the test and receiving organization. In-office collection is available by appointment in Wilmington. Mobile collection may be available by appointment within the accepted mobile service area.",
    included: [
      "Paternity, grandparent, siblingship, avuncular, and immigration collections — subject to lab and case requirements.",
      "In-office collection by appointment in Wilmington.",
      "Mobile collection by appointment, subject to availability.",
      "Identity verification and chain-of-custody documentation for the collection SIH&S performs.",
      "SIH&S is not a medical provider and does not confirm pregnancy, gestational age, fetal health, or medical suitability.",
    ],
    pricing: PRICING_APPOINTMENT,
  },
  {
    slug: "pim-vee",
    title: "PIM-VEE™",
    short: "PIM-VEE™",
    descriptor: "Post-incident documentation at time of arrival.",
    kind: "appointment",
    hero: "docs",
    description:
      "PIM-VEE™ (Post-Incident Motor Vehicle Coordination & Documentation Services — \"PIMVCDS\") is employer-directed documentation of observable conditions at the time of arrival. It is non-investigative. It does not include scene control or evidence handling. SIH&S records neutral, factual observations. PIM-VEE™ is not accident investigation, fault determination, causation analysis, or evidence handling or preservation. It does not interfere with law enforcement, EMS, or property management.",
    included: [
      "Employer-Directed | Non-Investigative | No Scene Control | No Evidence Handling",
      "Observable conditions documented at the time of arrival.",
      "Scheduled by appointment, subject to staffing and location.",
      "Does not interfere with law enforcement, EMS, or property management.",
    ],
    pricing: PRICING_APPOINTMENT,
  },
  {
    slug: "notary",
    title: "Notary",
    short: "Notary",
    descriptor: "Mobile notary by appointment.",
    kind: "appointment",
    hero: "notary",
    description:
      "SIH&S provides mobile notary services by appointment. The administrative office at 1201 N. Orange St., Suite 7724, Wilmington, DE 19801 is an appointment-only office. No walk-in notary service is available there. The signer must appear, present acceptable identification, and sign in the notary’s presence. Availability depends on staffing, location, and scheduling. SIH&S does not provide legal advice.",
    included: [
      "Mobile notary by appointment.",
      "Northern New Castle County, Delaware.",
      "Acceptable identification required.",
      "No walk-in notary at the administrative office.",
    ],
    pricing: PRICING_APPOINTMENT,
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

export type LegalId =
  | "terms"
  | "privacy"
  | "arbitration"
  | "nondiscrimination"
  | "accessibility";

export const LEGAL_LINKS: { id: LegalId; title: string }[] = [
  { id: "terms", title: "Full Terms & Agreement" },
  { id: "privacy", title: "Privacy Policy" },
  { id: "arbitration", title: "Arbitration Notice" },
  { id: "nondiscrimination", title: "Non-Discrimination Statement" },
  { id: "accessibility", title: "Accessibility Statement" },
];

export const LEGAL: Record<LegalId, { title: string; paragraphs: string[] }> = {
  terms: {
    title: "Full Terms & Agreement",
    paragraphs: [
      "These terms govern services requested from Susan's Intercessory Hooks & Services LLC, doing business as SIH&S (\"SIH&S\").",
      "Public-facing services are offered under the name SIH&S. The legal entity is Susan's Intercessory Hooks & Services LLC.",
      "Primary service area: Northern New Castle County, Delaware. Delaware intrastate towing only. Interstate movements are coordinated through properly authorized carriers.",
      "SIH&S generally accepts direct private-pay towing and roadside requests within an 18-mile radius of 1201 N. Orange St., Suite 7724, Wilmington, DE 19801. That address is an administrative office. It is not a tow yard, vehicle-storage lot, repair facility, or walk-in vehicle-release location.",
      "All pricing is confirmed prior to deposit. A deposit is required before scheduling or dispatch. Final price for towing and roadside service depends on location, access, and conditions. The quote is confirmed before dispatch.",
      "Submitting a request in this app is a service inquiry until SIH&S accepts it. It does not by itself dispatch a truck, reserve an appointment, confirm an ETA, or create a payment obligation.",
      "Cancellation and refunds. Refund eligibility is determined by SIH&S in accordance with these Full Terms & Agreement. A cancellation does not automatically produce a refund. If a deposit was collected and dispatch had occurred, the deposit is earned upon dispatch (non-refundable to the extent permitted by law).",
      "SIH&S performs specimen collection only for drug, alcohol, and DNA services. Laboratory analysis and MRO review are conducted by accredited third parties. No compliance guarantee is provided by SIH&S.",
      "PIM-VEE™ means Post-Incident Motor Vehicle Coordination & Documentation Services (\"PIMVCDS\"). It is employer-directed, non-investigative, and does not include scene control or evidence handling. SIH&S does not provide accident investigation, fault determination, causation analysis, or accident reconstruction.",
      "Where an integrated workflow is offered, the names are HOOK & TEST™ — U.S. Patent Pending and HOOK & PIM-VEE™ — U.S. Patent Pending. U.S. Patent Pending refers to pending U.S. patent application(s) related to integrated workflow controls and is not a guarantee of patent grant. Patent language does not apply to standalone Towing, standalone DNA, standalone Testing, or standalone PIM-VEE™.",
      "Availability varies by service, staffing, location, and dispatch capacity. SIH&S is on call 24/7 to receive service requests, including nights, weekends, and holidays. Actual dispatch and appointment availability depend on operating conditions.",
      "For towing or roadside service, call 302-406-HOOK (4665).",
      "Disputes are subject to the Arbitration Notice, including binding arbitration, a jury-trial waiver, and a class-action waiver, except where applicable law does not permit those terms.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    paragraphs: [
      "Susan's Intercessory Hooks & Services LLC (\"SIH&S\") collects the account and request information you submit in this app, including name, email, phone number, saved locations, vehicle details you choose to provide, and appointment or dispatch records.",
      "SIH&S uses that information to create your account, respond to service requests, send service-related calls and text messages you consent to, and complete scheduling or payment through Square.",
      "This app does not collect or store raw payment-card numbers. Card payments are handled by Square. The app may show a masked last-four reference returned by Square.",
      "Do not submit DNA or drug and alcohol results, medical information, Social Security numbers, government identification images, or complete payment-card information through general message fields.",
      "By providing your phone number, you consent to receive service-related calls and text messages from SIH&S. Message and data rates may apply. Message frequency varies. Reply STOP to opt out. Reply HELP for assistance.",
      "Contact: sihs@susanshooks.com or 302-406-HOOK (4665). Mailing address: 1201 N. Orange St., Suite 7724, Wilmington, DE 19801.",
    ],
  },
  arbitration: {
    title: "Arbitration Notice",
    paragraphs: [
      "Please read this Arbitration Notice carefully. It affects how disputes with Susan's Intercessory Hooks & Services LLC (\"SIH&S\") are resolved.",
      "Binding arbitration. Except where applicable law does not allow it, any dispute, claim, or controversy arising out of or relating to SIH&S services, these terms, or this app shall be resolved by binding individual arbitration, and not in court.",
      "Jury-trial waiver. You and SIH&S waive any right to a trial by jury for disputes covered by this notice.",
      "Class-action waiver. Arbitration and any permitted court proceeding shall proceed on an individual basis only. You and SIH&S waive any right to participate in a class action, collective action, or representative proceeding.",
      "This notice is part of the Full Terms & Agreement. If a court finds a waiver unenforceable for a particular claim, that claim shall proceed in court only to the extent required by law, and the remainder of this notice stays in effect.",
    ],
  },
  nondiscrimination: {
    title: "Non-Discrimination Statement",
    paragraphs: [
      "Susan's Intercessory Hooks & Services LLC (\"SIH&S\") does not discriminate on the basis of race, color, religion or creed, sex, national origin, age, disability, genetic information, veteran status, or any other protected status.",
      "SIH&S provides services in accordance with applicable non-discrimination laws. If you need an accommodation to access a service, contact SIH&S at 302-406-HOOK (4665) or sihs@susanshooks.com.",
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    paragraphs: [
      "Susan's Intercessory Hooks & Services LLC (\"SIH&S\") intends this app to meet WCAG 2.1 Level AA.",
      "Controls use visible text labels, a minimum 44 by 44 point target, and a visible focus indicator. Error messages use an icon and text. Color is not the only means of conveying status.",
      "Brand green #5fbb3f does not meet 4.5:1 as text on white (measured 2.42:1). Button labels use #001e16 on #5fbb3f (measured 7.24:1). Green text on white uses #2f7a1c (measured 5.36:1). Accent green on the #001e16 background measures 7.24:1.",
      "A full VoiceOver pass on a physical device still needs to be completed with the client on the next build review. If you encounter a barrier, contact sihs@susanshooks.com or 302-406-HOOK (4665).",
    ],
  },
};

export function formatPhone(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}
