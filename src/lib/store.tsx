import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { CUSTOMER_CONFIG, PENDING_STATUS } from "./customer-config";
import { clearStorage, readStorage, writeStorage } from "./storage";

export type AccountStatus = "active" | "pending" | "revoked";
export type CustomerRole = "Customer" | "Facility Manager" | "Authorized Requester";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  accountStatus?: AccountStatus;
  roles?: CustomerRole[];
  organization?: string;
  organizationAccess?: "none" | "pending" | "linked";
  approvalLimit?: string;
  authorizedRequester?: boolean;
  smsAccepted?: boolean;
};

export type SavedLocation = {
  id: string;
  label: string;
  line: string;
  entrance?: string;
  pickup?: string;
};

export type BookingStatus = "pending" | "ongoing" | "completed" | "canceled" | "cancellation-requested";
export type SyncStatus = "saved-locally" | "uploading" | "received";

export type StatusEvent = { at: string; label: string; source: "customer" | "sihs" };
export type StaffNote = { at: string; author: string; body: string };

export type Booking = {
  id: string;
  serviceSlug: string;
  serviceTitle: string;
  status: BookingStatus;
  area: string;
  when: string;
  locationType?: string;
  cancelReason?: "User canceled" | "No-show" | "Provider canceled";
  depositDispatched?: boolean;
  squareRef?: string;
  statusHistory?: StatusEvent[];
  callback?: string;
  propertyAddress?: string;
  serviceEntrance?: string;
  pickupLocation?: string;
  authorizationPending?: boolean;
  requestType?: "listed" | "unlisted" | "supplies" | "products";
  customerLabel?: string;
  syncStatus?: SyncStatus;
  scope?: string;
  preferredTiming?: string;
  serviceLocation?: string;
  organizationLabel?: string;
  quote?: string;
  depositPaid?: boolean;
  delivered?: boolean;
  acceptedByCustomer?: boolean;
  sharedTitle?: string;
  sharedAcknowledgedAt?: string;
  vehicleSummary?: string;
  paymentSummary?: string;
  staffNotes?: StaffNote[];
  requesterName?: string;
  poNumber?: string;
  photoCount?: number;
  photoState?: "sample" | "customer" | "none";
  detailSummary?: string;
};

export type IncidentReport = {
  id: string;
  type: string;
  details: string;
  restricted: boolean;
  at: string;
  status?: "Received" | "Under review" | "Closed";
  requestId?: string;
};

export type DraftRequest = {
  serviceSlug: string;
  locationType?: "in-office" | "mobile";
  when?: string;
  vehicle?: {
    make: string;
    model: string;
    year: string;
    color: string;
    plate: string;
    notes: string;
  };
  termsAccepted?: boolean;
  smsAccepted?: boolean;
  callback?: string;
  propertyAddress?: string;
  serviceEntrance?: string;
  pickupLocation?: string;
  authorizationPending?: boolean;
  requestType?: "listed" | "unlisted" | "supplies" | "products";
  description?: string;
};

export type Toast = { id: number; title: string; body?: string };

type Store = {
  user: User | null;
  guest: boolean;
  onboarded: boolean;
  pendingEmail: string | null;
  verifyCode: string | null;
  locations: SavedLocation[];
  bookings: Booking[];
  draft: DraftRequest | null;
  cardLast4: string | null;
  toasts: Toast[];
  markOnboarded: () => void;
  continueAsGuest: () => void;
  login: (email: string, password: string) => { ok: true } | { ok: false; reason: string };
  beginSignup: (input: Omit<User, "id">) => { ok: true; email: string; code: string } | { ok: false; reason: string };
  verifyEmail: (code: string) => boolean;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  approveAccount: () => void;
  addLocation: (loc: Omit<SavedLocation, "id">) => void;
  updateLocation: (id: string, patch: Partial<SavedLocation>) => void;
  removeLocation: (id: string) => void;
  setDraft: (draft: DraftRequest | null) => void;
  patchDraft: (patch: Partial<DraftRequest>) => void;
  incidents: IncidentReport[];
  completeBooking: (input: { squareRef: string; when: string; locationType?: string }) => string;
  submitRequest: (input: DraftRequest & {
    serviceTitle: string;
    offline?: boolean;
    requesterName?: string;
    organizationLabel?: string;
    poNumber?: string;
    photoCount?: number;
    detailSummary?: string;
    vehicleSummary?: string;
  }) => { id: string; duplicate: boolean };
  recordDeposit: (id: string, kind: "deposit" | "balance") => void;
  acceptDelivery: (id: string) => void;
  reportDeliveryIssue: (id: string, issue: string) => void;
  acknowledgeShared: (id: string) => void;
  cancelBooking: (id: string) => void;
  requestOrganizationAccess: (input: { organization: string; property: string; note: string }) => void;
  changePassword: (current: string, next: string) => { ok: true } | { ok: false; reason: string };
  submitIncident: (input: { type: string; details: string; restricted: boolean; requestId?: string }) => string;
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
};

const Ctx = createContext<Store | null>(null);

const SEED_USER: User = {
  id: "u-demo",
  fullName: "Susan Hooks",
  email: "admin@gamil.com",
  phone: "(302) 406-4665",
  password: "123456",
  address: "1201 N. Orange St., Suite 7724, Wilmington, DE 19801",
  organization: "Northern New Castle Properties",
  organizationAccess: "linked",
  approvalLimit: "$500",
  authorizedRequester: true,
  roles: ["Customer", "Facility Manager"],
  smsAccepted: true,
};

const SAMPLE_JOBS: Booking[] = [
  {
    id: "SIHS-220184",
    serviceSlug: "towing",
    serviceTitle: "Delaware Intrastate Towing",
    status: "completed",
    photoState: "sample",
    customerLabel: "Completed",
    area: "Northern New Castle County, DE",
    when: "Completed Oct 12, 2026 · 10:22 AM",
    preferredTiming: "As soon as possible",
    callback: "(302) 406-4665",
    propertyAddress: "1201 N. Orange St., Wilmington, DE 19801",
    serviceLocation: "Suite 7724 loading area",
    organizationLabel: "Northern New Castle Properties",
    vehicleSummary: "2019 Honda CR-V · White · Plate DE-4821",
    scope: "Light-duty tow from the loading area to the designated drop on the same property.",
    quote: "Quote confirmed before dispatch. Deposit $75. Balance $185.",
    paymentSummary: "Deposit $75 and balance $185 received.",
    depositPaid: true,
    squareRef: "SQ-220184",
    syncStatus: "received",
    statusHistory: [
      { at: "2026-10-12T12:14:00.000Z", label: "Received—pending confirmation", source: "customer" },
      { at: "2026-10-12T12:41:00.000Z", label: "Confirmed—deposit required", source: "sihs" },
      { at: "2026-10-12T13:02:00.000Z", label: "Deposit received", source: "sihs" },
      { at: "2026-10-12T13:18:00.000Z", label: "Assigned", source: "sihs" },
      { at: "2026-10-12T13:46:00.000Z", label: "In progress", source: "sihs" },
      { at: "2026-10-12T14:22:00.000Z", label: "Completed", source: "sihs" },
    ],
    staffNotes: [
      { at: "2026-10-12T12:41:00.000Z", author: "SIH&S", body: "Request confirmed. Deposit is required before the crew is dispatched. A preferred time is not an arrival promise." },
      { at: "2026-10-12T13:18:00.000Z", author: "SIH&S dispatch", body: "Crew assigned for a light-duty tow. Live worker location is not shared with the customer." },
      { at: "2026-10-12T13:46:00.000Z", author: "SIH&S crew", body: "Before photos taken at the loading area. Vehicle is a white 2019 Honda CR-V, plate DE-4821. No private-property authorization issue." },
      { at: "2026-10-12T14:22:00.000Z", author: "SIH&S crew", body: "Tow completed. After photos added. Vehicle was left at the designated drop on the same property. Original request remains on this record." },
    ],
  },
  {
    id: "SIHS-331902",
    serviceSlug: "lockouts",
    serviceTitle: "Vehicle Lockout",
    status: "completed",
    photoState: "sample",
    customerLabel: "Completed",
    area: "Northern New Castle County, DE",
    when: "Completed Oct 8, 2026 · 4:05 PM",
    preferredTiming: "Today, afternoon",
    callback: "(302) 406-4665",
    propertyAddress: "1007 N. Market St., Wilmington, DE 19801",
    serviceLocation: "Visitor lot, row C",
    organizationLabel: "Northern New Castle Properties",
    vehicleSummary: "2021 Honda Civic · Gray · Plate DE-1904",
    scope: "Unlock the driver door. No towing and no entry into the building.",
    quote: "Quote confirmed before dispatch. Balance $95.",
    paymentSummary: "Balance $95 received. No deposit was required.",
    depositPaid: true,
    squareRef: "SQ-331902",
    syncStatus: "received",
    statusHistory: [
      { at: "2026-10-08T18:20:00.000Z", label: "Received—pending confirmation", source: "customer" },
      { at: "2026-10-08T18:48:00.000Z", label: "Confirmed", source: "sihs" },
      { at: "2026-10-08T19:10:00.000Z", label: "Assigned", source: "sihs" },
      { at: "2026-10-08T19:36:00.000Z", label: "In progress", source: "sihs" },
      { at: "2026-10-08T20:05:00.000Z", label: "Completed", source: "sihs" },
    ],
    staffNotes: [
      { at: "2026-10-08T18:48:00.000Z", author: "SIH&S", body: "Lockout confirmed for the visitor lot. Keys are locked inside the vehicle. This note does not schedule a separate appointment." },
      { at: "2026-10-08T19:36:00.000Z", author: "SIH&S crew", body: "Before photo taken at row C. Gray 2021 Honda Civic, plate DE-1904. Door was locked with the keys visible inside." },
      { at: "2026-10-08T20:05:00.000Z", author: "SIH&S crew", body: "Driver door unlocked without damage. After photo added. Customer had the keys before the crew left." },
    ],
  },
  {
    id: "SIHS-440771",
    serviceSlug: "fuel-delivery",
    serviceTitle: "Fuel Delivery",
    status: "canceled",
    customerLabel: "Canceled",
    area: "Northern New Castle County, DE",
    when: "Canceled Oct 14, 2026 · 11:16 AM",
    preferredTiming: "Morning",
    callback: "(302) 406-4665",
    propertyAddress: "800 N. French St., Wilmington, DE 19801",
    serviceLocation: "Street parking, French Street",
    organizationLabel: "Northern New Castle Properties",
    vehicleSummary: "2016 Honda Accord · Black · Plate DE-7730",
    scope: "Deliver fuel to a passenger vehicle. Crew was not dispatched.",
    cancelReason: "User canceled",
    depositDispatched: false,
    quote: "Quote was confirmed. No deposit was collected.",
    paymentSummary: "No payment collected. Refund review is not required.",
    syncStatus: "received",
    statusHistory: [
      { at: "2026-10-14T14:02:00.000Z", label: "Received—pending confirmation", source: "customer" },
      { at: "2026-10-14T14:28:00.000Z", label: "Confirmed—deposit required", source: "sihs" },
      { at: "2026-10-14T15:04:00.000Z", label: "Cancellation requested—pending SIH&S confirmation.", source: "customer" },
      { at: "2026-10-14T15:16:00.000Z", label: "Canceled", source: "sihs" },
    ],
    staffNotes: [
      { at: "2026-10-14T14:28:00.000Z", author: "SIH&S", body: "Fuel delivery confirmed for a black 2016 Honda Accord. Deposit was requested. The crew was not assigned." },
      { at: "2026-10-14T15:04:00.000Z", author: "Customer", body: "Cancellation requested before dispatch. The vehicle was moved by the customer." },
      { at: "2026-10-14T15:16:00.000Z", author: "SIH&S", body: "Cancellation confirmed. No crew was sent and no deposit was charged. Before and after photos were not taken." },
    ],
  },
  {
    id: "SIHS-551063",
    serviceSlug: "jump-starts",
    serviceTitle: "Jump Start",
    status: "canceled",
    customerLabel: "Canceled",
    area: "Northern New Castle County, DE",
    when: "Canceled Oct 5, 2026 · 7:48 PM",
    preferredTiming: "Evening",
    callback: "(302) 406-4665",
    propertyAddress: "222 Delaware Ave., Wilmington, DE 19801",
    serviceLocation: "Garage level 1, space 18",
    organizationLabel: "Northern New Castle Properties",
    vehicleSummary: "2018 Honda Pilot · Blue · Plate DE-2268",
    scope: "Jump start a passenger vehicle in the garage.",
    cancelReason: "Provider canceled",
    depositDispatched: true,
    depositPaid: true,
    squareRef: "SQ-551063",
    quote: "Deposit $50 collected before dispatch.",
    paymentSummary: "Deposit $50 was earned because the crew was dispatched.",
    syncStatus: "received",
    statusHistory: [
      { at: "2026-10-05T22:10:00.000Z", label: "Received—pending confirmation", source: "customer" },
      { at: "2026-10-05T22:24:00.000Z", label: "Confirmed—deposit required", source: "sihs" },
      { at: "2026-10-05T22:40:00.000Z", label: "Deposit received", source: "sihs" },
      { at: "2026-10-05T22:55:00.000Z", label: "Assigned", source: "sihs" },
      { at: "2026-10-05T23:48:00.000Z", label: "Canceled", source: "sihs" },
    ],
    staffNotes: [
      { at: "2026-10-05T22:55:00.000Z", author: "SIH&S dispatch", body: "Crew dispatched to garage level 1 after the deposit was received." },
      { at: "2026-10-05T23:30:00.000Z", author: "SIH&S crew", body: "Arrived at space 18. The vehicle was gone and the space was empty. No jump was performed. No before or after photos." },
      { at: "2026-10-05T23:48:00.000Z", author: "SIH&S", body: "Provider canceled the job after dispatch. The deposit is earned to the extent permitted by law. Refund eligibility is reviewed by SIH&S." },
    ],
  },
];

function withSampleJobs(list: Booking[]): Booking[] {
  const ids = new Set(list.map((job) => job.id));
  const catalog = [ACTIVE_SAMPLE, ...SAMPLE_JOBS];
  const missing = catalog.filter((job) => !ids.has(job.id));
  if (!missing.length) return list;
  return [...list, ...missing];
}

const DEFAULT_LOCATIONS: SavedLocation[] = [
  {
    id: "loc-hq",
    label: "Wilmington office",
    line: "1201 N. Orange St., Suite 7724, Wilmington, DE 19801",
    entrance: "Suite 7724, administrative office",
    pickup: "Confirm the actual service location at request time",
  },
];

const ACTIVE_SAMPLE: Booking = {
  id: "SIHS-104218",
  serviceSlug: "towing",
  serviceTitle: "Delaware Intrastate Towing",
  status: "ongoing",
  customerLabel: "Confirmed—deposit required",
  area: "Northern New Castle County, DE",
  when: "Preferred: As soon as possible. Not a confirmed appointment.",
  preferredTiming: "As soon as possible",
  callback: "(302) 406-4665",
  propertyAddress: "1201 N. Orange St., Suite 7724, Wilmington, DE 19801",
  serviceLocation: "Suite 7724 loading area",
  organizationLabel: "Northern New Castle Properties",
  requesterName: "Susan Hooks",
  scope: "Relocate a light-duty vehicle from the service entrance.",
  quote: "Quote confirmed by SIH&S before deposit.",
  syncStatus: "received",
  photoState: "none",
  statusHistory: [
    { at: "2026-10-14T14:10:00.000Z", label: "Received—pending confirmation", source: "customer" },
    { at: "2026-10-14T15:40:00.000Z", label: "Confirmed—deposit required", source: "sihs" },
  ],
};

function loadScopedBookings(userId: string | null, isGuest: boolean): Booking[] {
  const key = isGuest || !userId ? "bookings:guest" : `bookings:${userId}`;
  let list: Booking[] = [];
  const own = readStorage(key);
  if (own) {
    try {
      const parsed = JSON.parse(own) as Booking[];
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      list = [];
    }
  } else if (!isGuest && userId === "u-demo") {
    const legacy = readStorage("bookings");
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy) as Booking[];
        if (Array.isArray(parsed)) list = parsed;
      } catch {
        list = [];
      }
    }
  }
  const next = withSampleJobs(list);
  if (!own || next.length !== list.length) writeStorage(key, JSON.stringify(next));
  return next;
}

function loadScopedLocations(userId: string | null, isGuest: boolean): SavedLocation[] {
  if (isGuest || !userId) return [];
  const own = readStorage(`locations:${userId}`);
  if (own) {
    try {
      return JSON.parse(own) as SavedLocation[];
    } catch {
      return userId === "u-demo" ? DEFAULT_LOCATIONS : [];
    }
  }
  if (userId !== "u-demo") return [];
  const legacy = readStorage("locations");
  let list = DEFAULT_LOCATIONS;
  if (legacy) {
    try {
      const parsed = JSON.parse(legacy) as SavedLocation[];
      if (Array.isArray(parsed) && parsed.length) list = parsed;
    } catch {
      /* keep the office */
    }
  }
  writeStorage(`locations:${userId}`, JSON.stringify(list));
  return list;
}

function withDefaultLogin(list: User[]): User[] {
  const email = "admin@gamil.com";
  const password = "123456";
  const match = list.find((item) => item.email.toLowerCase() === email || item.id === "u-demo");
  const next = match
    ? list.map((item) =>
        item === match ? { ...item, email, password, accountStatus: "active" as const, smsAccepted: item.smsAccepted ?? true } : item,
      )
    : [...list, { ...SEED_USER, accountStatus: "active" as const }];
  const changed = JSON.stringify(next) !== JSON.stringify(list);
  if (changed) writeStorage("users", JSON.stringify(next));
  return next;
}

function loadJson<T>(key: string, fallback: T): T {
  const raw = readStorage(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => withDefaultLogin(loadJson("users", [SEED_USER])));
  const [user, setUser] = useState<User | null>(() => {
    const id = readStorage("session");
    if (!id) return null;
    const list = withDefaultLogin(loadJson<User[]>("users", [SEED_USER]));
    return list.find((u) => u.id === id) ?? null;
  });
  const [guest, setGuest] = useState(() => readStorage("guest") === "1");
  const [onboarded, setOnboarded] = useState(() => readStorage("onboarded") === "1");
  const [pending, setPending] = useState<{ user: User; code: string } | null>(null);
  const [locations, setLocations] = useState<SavedLocation[]>(() => {
    const session = readStorage("session");
    const isGuest = readStorage("guest") === "1";
    return loadScopedLocations(isGuest ? null : session, isGuest);
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const session = readStorage("session");
    const isGuest = readStorage("guest") === "1";
    return loadScopedBookings(isGuest ? null : session, isGuest);
  });
  const [draft, setDraftState] = useState<DraftRequest | null>(null);
  const [cardLast4, setCardLast4] = useState<string | null>(() => {
    const session = readStorage("session");
    const isGuest = readStorage("guest") === "1";
    if (isGuest || !session) return null;
    return readStorage(`card:${session}`);
  });
  const [incidents, setIncidents] = useState<IncidentReport[]>(() => loadJson("incidents", []));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastSubmit = useRef<{ key: string; id: string } | null>(null);

  const value = useMemo<Store>(() => {
    const pushToast = (title: string, body?: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, title, body }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
    };

    const persistUsers = (list: User[]) => {
      setUsers(list);
      writeStorage("users", JSON.stringify(list));
    };
    const bookingKey = !user || guest ? "bookings:guest" : `bookings:${user.id}`;
    const locationKey = !user || guest ? "" : `locations:${user.id}`;
    const cardKey = !user || guest ? "" : `card:${user.id}`;
    const saveBookings = (next: Booking[]) => {
      setBookings(next);
      writeStorage(bookingKey, JSON.stringify(next));
    };
    const saveLocations = (next: SavedLocation[]) => {
      setLocations(next);
      if (locationKey) writeStorage(locationKey, JSON.stringify(next));
    };
    const saveCard = (last4: string) => {
      if (!cardKey) return;
      setCardLast4(last4);
      writeStorage(cardKey, last4);
    };

    return {
      user,
      guest,
      onboarded,
      pendingEmail: pending?.user.email ?? null,
      verifyCode: pending?.code ?? null,
      locations,
      bookings,
      draft,
      cardLast4,
      toasts,
      incidents,
      markOnboarded: () => {
        setOnboarded(true);
        writeStorage("onboarded", "1");
      },
      continueAsGuest: () => {
        setGuest(true);
        setUser(null);
        writeStorage("guest", "1");
        clearStorage("session");
        writeStorage("onboarded", "1");
        setOnboarded(true);
        setBookings(loadScopedBookings(null, true));
        setLocations([]);
        setCardLast4(null);
      },
      login: (email, password) => {
        const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!found || found.password !== password) return { ok: false, reason: "Email or password is incorrect." };
        const nextUser = found.smsAccepted === undefined && found.id === "u-demo" ? { ...found, smsAccepted: true } : found;
        setUser(nextUser);
        setGuest(false);
        writeStorage("session", nextUser.id);
        clearStorage("guest");
        writeStorage("onboarded", "1");
        setOnboarded(true);
        setBookings(loadScopedBookings(nextUser.id, false));
        setLocations(loadScopedLocations(nextUser.id, false));
        setCardLast4(readStorage(`card:${nextUser.id}`));
        if (nextUser !== found) persistUsers(users.map((item) => (item.id === nextUser.id ? nextUser : item)));
        return { ok: true };
      },
      beginSignup: (input) => {
        if (users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
          return { ok: false, reason: "An account with that email already exists." };
        }
        const created: User = {
          id: `u${Date.now()}`,
          fullName: input.fullName.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          password: input.password,
          address: input.address?.trim() || undefined,
          accountStatus: "pending",
          roles: ["Customer"],
          organization: "Pending SIH&S assignment",
          organizationAccess: "none",
          smsAccepted: input.smsAccepted,
        };
        const code = String(Math.floor(100000 + Math.random() * 900000));
        persistUsers([...users, created]);
        setUser(created);
        setGuest(false);
        writeStorage("session", created.id);
        clearStorage("guest");
        writeStorage("onboarded", "1");
        setOnboarded(true);
        setPending({ user: created, code });
        setBookings(loadScopedBookings(created.id, false));
        setLocations(created.address ? [{ id: "loc-account", label: "Account address", line: created.address }] : []);
        if (created.address) writeStorage(`locations:${created.id}`, JSON.stringify([{ id: "loc-account", label: "Account address", line: created.address }]));
        setCardLast4(null);
        return { ok: true, email: created.email, code };
      },
      verifyEmail: (code) => {
        if (!pending || pending.code !== code.trim()) return false;
        const next = [...users, pending.user];
        persistUsers(next);
        setUser(pending.user);
        setGuest(false);
        writeStorage("session", pending.user.id);
        clearStorage("guest");
        writeStorage("onboarded", "1");
        setOnboarded(true);
        setPending(null);
        return true;
      },
      logout: () => {
        setUser(null);
        setGuest(false);
        clearStorage("session");
        clearStorage("guest");
        setBookings([]);
        setLocations([]);
        setCardLast4(null);
      },
      updateUser: (patch) => {
        if (!user) return;
        const next = { ...user, ...patch };
        setUser(next);
        persistUsers(users.map((u) => (u.id === next.id ? next : u)));
        pushToast("Profile updated");
      },
      approveAccount: () => {
        if (!user) return;
        const next: User = {
          ...user,
          accountStatus: "active",
          organization: user.organization === "Pending SIH&S assignment" ? "SIH&S customer" : user.organization,
        };
        setUser(next);
        persistUsers(users.map((u) => (u.id === next.id ? next : u)));
      },
      addLocation: (loc) => {
        if (!locationKey) return;
        const next = [{ ...loc, id: `loc${Date.now()}` }, ...locations];
        saveLocations(next);
        pushToast("Location saved");
      },
      updateLocation: (id, patch) => {
        if (!locationKey) return;
        const next = locations.map((l) => (l.id === id ? { ...l, ...patch } : l));
        saveLocations(next);
        pushToast("Location updated");
      },
      removeLocation: (id) => {
        if (!locationKey) return;
        const next = locations.filter((l) => l.id !== id);
        saveLocations(next);
        pushToast("Location deleted");
      },
      setDraft: (next) => setDraftState(next),
      patchDraft: (patch) => setDraftState((d) => (d ? { ...d, ...patch } : d)),
      submitRequest: (input) => {
        const key = `${input.serviceSlug}|${input.callback ?? ""}|${input.description ?? ""}|${input.when ?? ""}`;
        if (lastSubmit.current?.key === key) return { id: lastSubmit.current.id, duplicate: true };
        const id = `SIHS-${Date.now().toString().slice(-6)}`;
        const appointment = input.serviceSlug === "drug-alcohol" || input.serviceSlug === "dna" || input.serviceSlug === "notary";
        const label = input.authorizationPending
          ? "Authorization pending verification."
          : appointment
            ? "Appointment requested—pending SIH&S confirmation."
            : "Received—pending confirmation";
        const booking: Booking = {
          id,
          serviceSlug: input.serviceSlug,
          serviceTitle: input.serviceTitle,
          status: "pending",
          customerLabel: label,
          area: "Northern New Castle County, DE",
          when: `Preferred: ${input.when?.trim() || "As soon as possible"}. Not a confirmed appointment.`,
          preferredTiming: input.when,
          locationType: input.locationType,
          callback: input.callback,
          requesterName: input.requesterName,
          organizationLabel: input.organizationLabel,
          poNumber: input.poNumber,
          propertyAddress: input.propertyAddress,
          serviceEntrance: input.serviceEntrance,
          pickupLocation: input.pickupLocation,
          serviceLocation: input.pickupLocation,
          vehicleSummary: input.vehicleSummary,
          detailSummary: input.detailSummary,
          photoCount: input.photoCount,
          photoState: input.photoCount ? "customer" : "none",
          scope: input.description || input.vehicle?.notes,
          authorizationPending: input.authorizationPending,
          requestType: input.requestType ?? "listed",
          syncStatus: input.offline ? "saved-locally" : "received",
          statusHistory: [{ at: new Date().toISOString(), label, source: "customer" }],
        };
        saveBookings([booking, ...bookings]);
        setDraftState(null);
        lastSubmit.current = { key, id };
        return { id, duplicate: false };
      },
      recordDeposit: (id, kind) => {
        const next = bookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                squareRef: `SQ-${kind.toUpperCase()}-${Date.now().toString().slice(-6)}`,
                depositPaid: kind === "deposit" ? true : booking.depositPaid,
                customerLabel: kind === "deposit" ? "Confirmed" : booking.customerLabel,
                statusHistory: [
                  ...(booking.statusHistory ?? []),
                  { at: new Date().toISOString(), label: kind === "deposit" ? "Deposit paid through Square" : "Balance paid through Square", source: "customer" as const },
                ],
              }
            : booking,
        );
        saveBookings(next);
        saveCard("4242");
      },
      acceptDelivery: (id) => {
        const next = bookings.map((booking) =>
          booking.id === id ? { ...booking, acceptedByCustomer: true, customerLabel: "Customer accepted" } : booking,
        );
        saveBookings(next);
      },
      reportDeliveryIssue: (id, issue) => {
        const next = bookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                customerLabel: "Needs your input",
                statusHistory: [...(booking.statusHistory ?? []), { at: new Date().toISOString(), label: `Delivery issue reported: ${issue}`, source: "customer" as const }],
              }
            : booking,
        );
        saveBookings(next);
      },
      acknowledgeShared: (id) => {
        const next = bookings.map((booking) =>
          booking.id === id ? { ...booking, sharedAcknowledgedAt: new Date().toISOString() } : booking,
        );
        saveBookings(next);
      },
      requestOrganizationAccess: ({ organization, property, note }) => {
        if (!user) return;
        const next = {
          ...user,
          organization,
          organizationAccess: "pending" as const,
          address: property || user.address,
        };
        setUser(next);
        persistUsers(users.map((item) => (item.id === next.id ? next : item)));
        pushToast("Pending SIH&S verification.", note);
      },
      completeBooking: ({ squareRef, when, locationType }) => {
        const slug = draft?.serviceSlug ?? "towing";
        const title =
          slug === "towing"
            ? "Delaware Intrastate Towing"
            : slug === "lockouts"
              ? "Lockouts"
              : slug === "jump-starts"
                ? "Jump Starts"
                : slug === "fuel-delivery"
                  ? "Fuel Delivery"
                  : slug === "drug-alcohol"
                    ? "Drug & Alcohol Collections"
                    : slug === "dna"
                      ? "DNA Services"
                      : slug === "pim-vee"
                        ? "PIM-VEE™"
                        : "Notary";
        const id = `SIHS-${Date.now().toString().slice(-6)}`;
        const booking: Booking = {
          id,
          serviceSlug: slug,
          serviceTitle: title,
          status: "pending",
          area: "Northern New Castle County, DE",
          when: `Preferred: ${when.trim() || "As soon as possible"}. Not a confirmed appointment.`,
          locationType,
          squareRef,
          callback: draft?.callback,
          propertyAddress: draft?.propertyAddress,
          serviceEntrance: draft?.serviceEntrance,
          pickupLocation: draft?.pickupLocation,
          authorizationPending: draft?.authorizationPending,
          requestType: draft?.requestType ?? "listed",
          statusHistory: [
            {
              at: new Date().toISOString(),
              label: PENDING_STATUS,
              source: "customer",
            },
          ],
        };
        const next = [booking, ...bookings];
        saveBookings(next);
        saveCard("4242");
        setDraftState(null);
        return id;
      },
      cancelBooking: (id) => {
        const next = bookings.map((b) =>
          b.id === id
            ? {
                ...b,
                status: "cancellation-requested" as const,
                customerLabel: "Cancellation requested—pending SIH&S confirmation.",
                cancelReason: "User canceled" as const,
                depositDispatched: b.serviceSlug === "towing" || b.serviceSlug === "lockouts",
                statusHistory: [
                  ...(b.statusHistory ?? []),
                  { at: new Date().toISOString(), label: "Cancellation requested—pending SIH&S confirmation.", source: "customer" as const },
                ],
              }
            : b,
        );
        saveBookings(next);
        pushToast("Cancellation requested");
      },
      changePassword: (current, nextPassword) => {
        if (!user) return { ok: false as const, reason: "Sign in required." };
        if (current !== user.password) return { ok: false as const, reason: "Current password is incorrect." };
        if (nextPassword.trim().length < 8) return { ok: false as const, reason: "Use at least 8 characters." };
        const next = { ...user, password: nextPassword };
        setUser(next);
        persistUsers(users.map((u) => (u.id === next.id ? next : u)));
        pushToast("Password updated");
        return { ok: true as const };
      },
      submitIncident: ({ type, details, restricted, requestId }) => {
        const id = `INC-${Date.now().toString().slice(-6)}`;
        const report: IncidentReport = {
          id,
          type,
          details,
          restricted,
          at: new Date().toISOString(),
          status: "Received",
          requestId,
        };
        const next = [report, ...incidents];
        setIncidents(next);
        writeStorage("incidents", JSON.stringify(next));
        return id;
      },
      pushToast,
      dismissToast: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    };
  }, [user, guest, onboarded, pending, locations, bookings, draft, cardLast4, toasts, users, incidents]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
