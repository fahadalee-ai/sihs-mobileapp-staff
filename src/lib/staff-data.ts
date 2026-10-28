export type FunctionCode = "TOW" | "XPT" | "COL" | "DNA" | "NOT" | "LAW" | "CUR" | "PIM" | "OFC";
export type WorkerType = "employee" | "worker" | "supervisor";
export type AccountStatus = "pending" | "more-info" | "rejected" | "suspended" | "approved";
export type Source =
  | "Automatic"
  | "Employee-entered"
  | "Contractor-entered"
  | "Dispatcher-entered"
  | "Imported";

export type FunctionInfo = {
  code: FunctionCode;
  title: string;
  blurb: string;
};

export const FUNCTIONS: FunctionInfo[] = [
  { code: "TOW", title: "Towing & Roadside Operator", blurb: "Tow, lockout, jump start, and fuel delivery." },
  { code: "XPT", title: "Employee Transportation Driver", blurb: "Pickup, testing location, and return legs." },
  { code: "COL", title: "Drug & Alcohol Collector", blurb: "Specimen collection only. Lab review is third party." },
  { code: "DNA", title: "DNA Collector", blurb: "Collection only. Results go to named recipients." },
  { code: "NOT", title: "Mobile Notary", blurb: "Delaware mobile, in-person notary appointments." },
  { code: "LAW", title: "Lawncare & Janitorial Crew", blurb: "Property visits, area checklists, and photos." },
  { code: "CUR", title: "Courier & Product Fulfillment", blurb: "Item handoff, delivery, and exceptions." },
  { code: "PIM", title: "PIM-VEE™ Documentation Specialist", blurb: "Neutral factual documentation. No fault finding." },
  { code: "OFC", title: "Dispatch / Office Support", blurb: "Daily-log duties only. No field job access from this role." },
];

export function functionTitle(code: FunctionCode) {
  return FUNCTIONS.find((item) => item.code === code)?.title ?? code;
}

export type QualStatus = "Submitted—pending verification" | "Verified" | "Expired" | "Rejected";

export type Qualification = {
  id: string;
  userId: string;
  code: FunctionCode;
  name: string;
  status: QualStatus;
  expires?: string;
  replaces?: string;
};

export type StaffUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  workerType: WorkerType;
  companyName?: string;
  requestedRoles: FunctionCode[];
  approvedRoles: FunctionCode[];
  supervisorFlag: boolean;
  organization: string;
  supervisor: string;
  properties: string[];
  memberSince: string;
  status: AccountStatus;
  submittedAt: string;
  adminNote?: string;
  setupDone: boolean;
  activeRole: FunctionCode;
};

export type TimelineEvent = {
  id: string;
  type: string;
  source: Source;
  at: string;
  receivedAt: string;
  location: string;
  accuracy: string;
  original?: string;
  corrections?: { author: string; reason: string; at: string; value: string }[];
};

export type JobStatus =
  | "Assigned"
  | "In Progress"
  | "Completed"
  | "Needs Attention"
  | "Waiting for approval"
  | "Submitted — awaiting SIH&S approval"
  | "Checked out—documentation incomplete";

export type Job = {
  id: string;
  service: string;
  functionCode: FunctionCode;
  property: string;
  propertyAddress: string;
  serviceLocation: string;
  access: string;
  exclusions: string;
  when: string;
  status: JobStatus;
  latestSource: Source;
  latestLabel: string;
  scope: string;
  tasks: string[];
  completion: string[];
  assignee: string;
  company: string;
  parentIncident?: string;
  linked: { id: string; service: string; status: string }[];
  changes: { at: string; kind: string; body: string }[];
  events: TimelineEvent[];
  vehicle?: string;
  authority?: string;
  authVerified?: boolean;
  privateProperty?: boolean;
  interstate?: boolean;
  pickup?: string;
  destination?: string;
  phase: number;
  beforeDone: boolean;
  afterDone: boolean;
  hazardNote?: string;
  extraWork?: string;
  eta?: string;
  missing: string[];
  crew?: { name: string; status: string }[];
  program?: string;
  participants?: string;
  lab?: string;
  recipients?: string;
  legs?: { name: string; place: string; status: string }[];
  items?: { name: string; qty: string; handoff: string }[];
  delivered?: boolean;
  customerAccepted?: boolean;
  equipmentWarning?: string;
};

export type LogEntry = {
  id: string;
  duty: string;
  body: string;
  source: Source;
  at: string;
  author: string;
  correctionOf?: string;
  reason?: string;
};

export type StaffReport = {
  id: string;
  category: string;
  body: string;
  at: string;
  status: "Received" | "Under review" | "Action required" | "Closed";
  reviewer?: string;
  restrictedRoute: boolean;
  updates: { at: string; body: string }[];
  jobId?: string;
};

export type SyncItem = {
  id: string;
  type: string;
  jobId: string;
  eventTime: string;
  status: "Saved locally" | "Uploading" | "Received" | "Archived" | "Upload failed — will retry";
  conflict?: boolean;
  duplicate?: boolean;
};

export type StaffNotice = {
  id: string;
  type: string;
  text: string;
  href: string;
  at: string;
};

export const DEMO_USERS: StaffUser[] = [
  {
    id: "st-dana",
    fullName: "Dana Brooks",
    email: "dana.brooks@sihs.local",
    phone: "(302) 555-0142",
    password: "Staff1234",
    workerType: "employee",
    requestedRoles: ["TOW", "PIM"],
    approvedRoles: ["TOW", "XPT", "COL", "DNA", "NOT", "LAW", "CUR", "PIM", "OFC"],
    supervisorFlag: true,
    organization: "SIH&S",
    supervisor: "Wilmington dispatch",
    properties: ["Wilmington office", "Market Street lot"],
    memberSince: "Mar 2024",
    status: "approved",
    submittedAt: "2026-03-02",
    setupDone: true,
    activeRole: "TOW",
  },
  {
    id: "st-first",
    fullName: "Taylor Nguyen",
    email: "taylor.nguyen@sihs.local",
    phone: "(302) 555-0177",
    password: "Staff1234",
    workerType: "employee",
    requestedRoles: ["TOW", "PIM"],
    approvedRoles: ["TOW"],
    supervisorFlag: false,
    organization: "SIH&S",
    supervisor: "Wilmington dispatch",
    properties: ["Wilmington office"],
    memberSince: "Oct 2026",
    status: "approved",
    submittedAt: "2026-10-10",
    setupDone: false,
    activeRole: "TOW",
  },
  {
    id: "st-pending",
    fullName: "Avery Quinn",
    email: "avery.quinn@sihs.local",
    phone: "(302) 555-0190",
    password: "Staff1234",
    workerType: "worker",
    companyName: "River Towing Co.",
    requestedRoles: ["TOW", "CUR"],
    approvedRoles: [],
    supervisorFlag: false,
    organization: "Pending SIH&S assignment",
    supervisor: "Not assigned",
    properties: [],
    memberSince: "—",
    status: "pending",
    submittedAt: "2026-10-14",
    setupDone: false,
    activeRole: "TOW",
  },
  {
    id: "st-info",
    fullName: "Riley Santos",
    email: "riley.santos@sihs.local",
    phone: "(302) 555-0118",
    password: "Staff1234",
    workerType: "worker",
    companyName: "Northline Courier",
    requestedRoles: ["CUR"],
    approvedRoles: [],
    supervisorFlag: false,
    organization: "Pending SIH&S assignment",
    supervisor: "Not assigned",
    properties: [],
    memberSince: "—",
    status: "more-info",
    submittedAt: "2026-10-12",
    adminNote: "Upload a current driver's license photo. The company phone number was incomplete.",
    setupDone: false,
    activeRole: "CUR",
  },
  {
    id: "st-no",
    fullName: "Morgan Ellis",
    email: "morgan.ellis@sihs.local",
    phone: "(302) 555-0164",
    password: "Staff1234",
    workerType: "employee",
    requestedRoles: ["NOT"],
    approvedRoles: [],
    supervisorFlag: false,
    organization: "SIH&S",
    supervisor: "Not assigned",
    properties: [],
    memberSince: "—",
    status: "rejected",
    submittedAt: "2026-10-08",
    adminNote: "Delaware notary commission was not included.",
    setupDone: false,
    activeRole: "NOT",
  },
  {
    id: "st-end",
    fullName: "Sam Patel",
    email: "sam.patel@sihs.local",
    phone: "(302) 555-0133",
    password: "Staff1234",
    workerType: "worker",
    companyName: "River Towing Co.",
    requestedRoles: ["TOW"],
    approvedRoles: ["TOW"],
    supervisorFlag: false,
    organization: "SIH&S",
    supervisor: "Wilmington dispatch",
    properties: [],
    memberSince: "Jan 2025",
    status: "suspended",
    submittedAt: "2025-01-09",
    setupDone: true,
    activeRole: "TOW",
  },
];

export const SEED_QUALS: Qualification[] = [
  { id: "q1", userId: "st-dana", code: "TOW", name: "Driver's license, class D", status: "Verified", expires: "Apr 2, 2028" },
  { id: "q2", userId: "st-dana", code: "TOW", name: "Insurance document", status: "Verified", expires: "Jan 15, 2027" },
  { id: "q3", userId: "st-dana", code: "COL", name: "Collector training", status: "Expired", expires: "Aug 1, 2026" },
  { id: "q4", userId: "st-first", code: "TOW", name: "Driver's license, class D", status: "Submitted—pending verification", expires: "Jun 1, 2029" },
];

const at = (iso: string) => iso;

export const SEED_JOBS: Job[] = [
  {
    id: "SIHS-J-220184",
    service: "Delaware Intrastate Towing",
    functionCode: "TOW",
    property: "Wilmington office",
    propertyAddress: "1201 N. Orange St., Wilmington, DE 19801",
    serviceLocation: "Suite 7724 loading area",
    access: "Check in at reception. Use the Orange Street service door.",
    exclusions: "Do not photograph the server room.",
    when: "Today, 9:40 AM",
    status: "Assigned",
    latestSource: "Dispatcher-entered",
    latestLabel: "Assignment sent",
    scope: "Light-duty tow from the loading area to a drop on the same property.",
    tasks: ["Confirm authority", "Photograph existing damage", "Record destination handoff"],
    completion: ["Before photos", "After photos", "Handoff name and time"],
    assignee: "Dana Brooks",
    company: "SIH&S",
    parentIncident: "INC-1044",
    linked: [
      { id: "SIHS-J-220184", service: "Delaware Intrastate Towing", status: "Assigned" },
      { id: "SIHS-J-220184-B", service: "Vehicle Lockout", status: "Assigned" },
    ],
    changes: [
      { at: "2026-10-16T12:10:00.000Z", kind: "Assignment", body: "Original assignment: Dana Brooks. This entry stays on the record." },
    ],
    events: [
      {
        id: "e1",
        type: "Assignment received",
        source: "Dispatcher-entered",
        at: at("2026-10-16T12:10:00.000Z"),
        receivedAt: at("2026-10-16T12:10:08.000Z"),
        location: "Wilmington dispatch",
        accuracy: "Not a field fix",
      },
    ],
    vehicle: "2019 Honda CR-V · White · Plate DE-4821",
    authority: "Property owner or manager — pending verification",
    authVerified: false,
    privateProperty: true,
    pickup: "Suite 7724 loading area",
    destination: "Same property, north lot",
    phase: 0,
    beforeDone: false,
    afterDone: false,
    eta: "About 25 minutes after travel starts",
    missing: [],
    equipmentWarning: "Flatbed is on the truck. Dolly is not listed on the equipment check.",
    crew: [
      { name: "Dana Brooks", status: "Assigned" },
      { name: "Crew member B", status: "Available" },
    ],
  },
  {
    id: "SIHS-J-331902",
    service: "Jump Start",
    functionCode: "TOW",
    property: "Market Street lot",
    propertyAddress: "1007 N. Market St., Wilmington, DE 19801",
    serviceLocation: "Visitor lot, row C",
    access: "Market Street gate. Space is marked visitor.",
    exclusions: "No passenger transport.",
    when: "Today, 11:15 AM",
    status: "In Progress",
    latestSource: "Employee-entered",
    latestLabel: "Work started",
    scope: "Jump start a passenger vehicle. Vehicle-only service.",
    tasks: ["Battery check", "Cable connection", "Vehicle start result", "Safety steps"],
    completion: ["Start result recorded", "Cables removed"],
    assignee: "Dana Brooks",
    company: "SIH&S",
    linked: [{ id: "SIHS-J-331902", service: "Jump Start", status: "In Progress" }],
    changes: [],
    events: [
      {
        id: "e2",
        type: "On scene—automatically detected",
        source: "Automatic",
        at: at("2026-10-16T14:20:00.000Z"),
        receivedAt: at("2026-10-16T14:20:06.000Z"),
        location: "Visitor lot, row C",
        accuracy: "12 m",
      },
    ],
    vehicle: "2021 Honda Civic · Gray",
    authority: "Registered owner",
    authVerified: true,
    privateProperty: false,
    phase: 4,
    beforeDone: true,
    afterDone: false,
    missing: [],
  },
  {
    id: "SIHS-J-440771",
    service: "Employee Transportation",
    functionCode: "XPT",
    property: "Wilmington office",
    propertyAddress: "1201 N. Orange St., Wilmington, DE 19801",
    serviceLocation: "Orange Street lobby",
    access: "Passenger waits in the lobby.",
    exclusions: "No medical information in the trip notes.",
    when: "Today, 1:00 PM",
    status: "Assigned",
    latestSource: "Dispatcher-entered",
    latestLabel: "Trip assigned",
    scope: "Transport a client employee to a testing location and back.",
    tasks: ["Passenger check", "Testing-location arrival", "Return journey"],
    completion: ["Each leg recorded", "Handoff recorded"],
    assignee: "Dana Brooks",
    company: "SIH&S",
    linked: [{ id: "SIHS-J-440771", service: "Employee Transportation", status: "Assigned" }],
    changes: [],
    events: [],
    phase: 0,
    beforeDone: false,
    afterDone: false,
    missing: [],
    legs: [
      { name: "Pickup", place: "1201 N. Orange St. lobby", status: "Not started" },
      { name: "Testing-location arrival", place: "800 N. French St., Wilmington, DE 19801", status: "Not started" },
      { name: "Return journey", place: "1201 N. Orange St. lobby", status: "Not started" },
    ],
  },
  {
    id: "SIHS-J-551063",
    service: "HOOK & TEST™",
    functionCode: "COL",
    property: "Wilmington office",
    propertyAddress: "1201 N. Orange St., Suite 7724, Wilmington, DE 19801",
    serviceLocation: "Collection room B",
    access: "In-office appointment. No donor photos.",
    exclusions: "Do not photograph donors, forms, or specimens for property documentation.",
    when: "Today, 2:30 PM",
    status: "Needs Attention",
    latestSource: "Dispatcher-entered",
    latestLabel: "Unacknowledged assignment",
    scope: "DOT collection. Official program forms stay attached. The app does not replace them.",
    tasks: ["Open authorization", "Collection milestones", "Specimen transfer"],
    completion: ["Official form uploaded", "Transfer recorded"],
    assignee: "Dana Brooks",
    company: "SIH&S",
    linked: [{ id: "SIHS-J-551063", service: "Drug & Alcohol Collection", status: "Needs Attention" }],
    changes: [],
    events: [],
    phase: 0,
    beforeDone: false,
    afterDone: false,
    missing: ["Acknowledge assignment"],
    program: "DOT",
    participants: "2 participants",
    lab: "Accredited third-party laboratory named on the program form",
    recipients: "Employer designated service agent",
  },
  {
    id: "SIHS-J-660214",
    service: "DNA Services",
    functionCode: "DNA",
    property: "Wilmington office",
    propertyAddress: "1201 N. Orange St., Wilmington, DE 19801",
    serviceLocation: "Collection room A",
    access: "In-office. No result viewing.",
    exclusions: "Staff cannot see laboratory results.",
    when: "Tomorrow, 9:00 AM",
    status: "Assigned",
    latestSource: "Dispatcher-entered",
    latestLabel: "Preferred time confirmed by dispatch",
    scope: "DNA collection only. Results release only to authorized recipients named on the consent.",
    tasks: ["Open consent", "Collection milestones", "Specimen transfer"],
    completion: ["Consent on file", "Transfer recorded"],
    assignee: "Dana Brooks",
    company: "SIH&S",
    linked: [{ id: "SIHS-J-660214", service: "DNA Services", status: "Assigned" }],
    changes: [],
    events: [],
    phase: 0,
    beforeDone: false,
    afterDone: false,
    missing: [],
    program: "DNA collection type: legal",
    participants: "1 participant",
    lab: "Designated laboratory on the consent",
    recipients: "Named on the consent only",
  },
  {
    id: "SIHS-J-770331",
    service: "Mobile Notary",
    functionCode: "NOT",
    property: "French Street",
    propertyAddress: "800 N. French St., Wilmington, DE 19801",
    serviceLocation: "Conference room, first floor",
    access: "Signer must appear in person.",
    exclusions: "Do not photograph notarized documents.",
    when: "Tomorrow, 3:00 PM",
    status: "Assigned",
    latestSource: "Dispatcher-entered",
    latestLabel: "Appointment assigned",
    scope: "Delaware mobile, in-person notary. Journal entries stay in a separate restricted section.",
    tasks: ["Confirm signer presence", "Document category only"],
    completion: ["Appointment record saved"],
    assignee: "Dana Brooks",
    company: "SIH&S",
    linked: [{ id: "SIHS-J-770331", service: "Mobile Notary", status: "Assigned" }],
    changes: [],
    events: [],
    phase: 0,
    beforeDone: false,
    afterDone: false,
    missing: [],
  },
  {
    id: "SIHS-J-880442",
    service: "Janitorial",
    functionCode: "LAW",
    property: "Wilmington office",
    propertyAddress: "1201 N. Orange St., Wilmington, DE 19801",
    serviceLocation: "Floors 1 and 2",
    access: "Suite 7724 key from reception.",
    exclusions: "Server room is a no-camera zone.",
    when: "Today, 4:00 PM",
    status: "In Progress",
    latestSource: "Employee-entered",
    latestLabel: "Before photos started",
    scope: "Interior zones on floors 1 and 2. Restricted-photo areas stay closed to the camera.",
    tasks: ["Area checklist", "Existing damage", "Cleanup and security check"],
    completion: ["Before photos of designated areas", "After photos of the same areas"],
    assignee: "Dana Brooks",
    company: "SIH&S",
    linked: [{ id: "SIHS-J-880442", service: "Janitorial", status: "In Progress" }],
    changes: [],
    events: [],
    phase: 3,
    beforeDone: false,
    afterDone: false,
    missing: ["Before photo, floor 2 restroom"],
  },
  {
    id: "SIHS-J-990118",
    service: "Courier or Product Delivery",
    functionCode: "CUR",
    property: "Wilmington office",
    propertyAddress: "1201 N. Orange St., Wilmington, DE 19801",
    serviceLocation: "Suite 7724 reception",
    access: "Leave boxes with reception if the recipient is out.",
    exclusions: "",
    when: "Today, 8:30 AM",
    status: "Completed",
    latestSource: "Employee-entered",
    latestLabel: "Delivered",
    scope: "Two boxes. Substitutions were not approved.",
    tasks: ["Item identification", "Handoff", "Delivery acknowledgment"],
    completion: ["Recipient name and time"],
    assignee: "Dana Brooks",
    company: "SIH&S",
    linked: [{ id: "SIHS-J-990118", service: "Courier or Product Delivery", status: "Delivered" }],
    changes: [],
    events: [],
    phase: 8,
    beforeDone: true,
    afterDone: true,
    missing: [],
    items: [{ name: "Office supply boxes", qty: "2", handoff: "Reception, 8:41 AM" }],
    delivered: true,
    customerAccepted: false,
  },
  {
    id: "SIHS-J-101055",
    service: "PIM-VEE™",
    functionCode: "PIM",
    property: "Delaware Avenue garage",
    propertyAddress: "222 Delaware Ave., Wilmington, DE 19801",
    serviceLocation: "Garage level 1",
    access: "On-scene contact meets at the garage office.",
    exclusions: "No fault, cause, or findings fields.",
    when: "Yesterday, 3:15 PM",
    status: "In Progress",
    latestSource: "Employee-entered",
    latestLabel: "Documentation started",
    scope: "Neutral, factual documentation. Employer-directed. Non-investigative. No scene control. No evidence handling.",
    tasks: ["Scene and vehicle media", "Statements", "Potential cameras"],
    completion: ["Classification on each statement"],
    assignee: "Dana Brooks",
    company: "SIH&S",
    parentIncident: "INC-2210",
    linked: [
      { id: "SIHS-J-101055", service: "PIM-VEE™", status: "In Progress" },
      { id: "SIHS-J-220184", service: "Delaware Intrastate Towing", status: "Assigned" },
    ],
    changes: [],
    events: [],
    phase: 4,
    beforeDone: false,
    afterDone: false,
    missing: [],
  },
];

export const SEED_LOG: LogEntry[] = [
  { id: "L1", duty: "Travel", body: "En route to Market Street lot.", source: "Automatic", at: "2026-10-16T14:05:00.000Z", author: "SIH&S" },
  { id: "L2", duty: "Arrival", body: "On scene at visitor lot, row C.", source: "Automatic", at: "2026-10-16T14:20:00.000Z", author: "SIH&S" },
  { id: "L3", duty: "Work update", body: "Jump start work started.", source: "Employee-entered", at: "2026-10-16T14:28:00.000Z", author: "Dana Brooks" },
];

export const SEED_REPORTS: StaffReport[] = [
  {
    id: "R-1842",
    category: "Near miss",
    body: "A vehicle rolled slightly after the wheel chock slipped on the garage slope.",
    at: "2026-10-15T18:12:00.000Z",
    status: "Under review",
    reviewer: "Safety desk",
    restrictedRoute: false,
    updates: [{ at: "2026-10-15T19:00:00.000Z", body: "Reviewer assigned. The original report is unchanged." }],
  },
];

export const SEED_SYNC: SyncItem[] = [
  { id: "S1", type: "Arrival event", jobId: "SIHS-J-331902", eventTime: "2026-10-16T14:20:00.000Z", status: "Received" },
  { id: "S2", type: "Before photo", jobId: "SIHS-J-880442", eventTime: "2026-10-16T15:02:00.000Z", status: "Saved locally" },
  { id: "S3", type: "Work update", jobId: "SIHS-J-331902", eventTime: "2026-10-16T14:28:00.000Z", status: "Uploading" },
  { id: "S4", type: "SharePoint packet", jobId: "SIHS-J-101055", eventTime: "2026-10-15T19:40:00.000Z", status: "Upload failed — will retry" },
];

export const SEED_NOTICES: StaffNotice[] = [
  { id: "N1", type: "Assignment received", text: "SIHS-J-220184 was assigned to you.", href: "/jobs/SIHS-J-220184", at: "2026-10-16T12:10:00.000Z" },
  { id: "N2", type: "Assignment changed", text: "SIHS-J-770331 was postponed by dispatch.", href: "/jobs/SIHS-J-770331", at: "2026-10-15T18:40:00.000Z" },
  { id: "N3", type: "Qualification expiring", text: "A collector training record is expired. Contact SIH&S.", href: "/qualifications", at: "2026-10-16T08:05:00.000Z" },
  { id: "N4", type: "Sync issue", text: "One item is saved locally and has not been received.", href: "/sync", at: "2026-10-16T15:12:00.000Z" },
  { id: "N5", type: "Approval or return for correction", text: "No completion is waiting on you.", href: "/jobs", at: "2026-10-16T09:00:00.000Z" },
];

export const WORK_STEPS = [
  "Travel",
  "Arrival",
  "Before documentation",
  "Hazard check",
  "Work in progress",
  "After documentation",
  "Submit completion",
  "Departure",
] as const;

export const PATENT_FOOTNOTE =
  "U.S. Patent Pending refers to pending U.S. patent application(s) related to integrated workflow controls and is not a guarantee of patent grant.";

export const TRACKING_COPY =
  "SIH&S collects your location only during active SIH&S assignments, including assigned travel, even when your screen is locked or another app is open. Tracking stops when your field activity ends. Your location is not tracked outside active work.";

export const LAB_LINE =
  "SIH&S performs specimen collection only. Laboratory analysis and MRO review are conducted by accredited third parties.";
