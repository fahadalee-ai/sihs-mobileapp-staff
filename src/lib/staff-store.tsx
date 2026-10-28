import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { clearStorage, readStorage, writeStorage } from "./storage";
import {
  DEMO_USERS,
  SEED_JOBS,
  SEED_LOG,
  SEED_NOTICES,
  SEED_QUALS,
  SEED_REPORTS,
  SEED_SYNC,
  type AccountStatus,
  type FunctionCode,
  type Job,
  type LogEntry,
  type Qualification,
  type Source,
  type StaffNotice,
  type StaffReport,
  type StaffUser,
  type SyncItem,
  type WorkerType,
} from "./staff-data";

export type ApplicationInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  workerType: WorkerType;
  companyName?: string;
  companyContact?: string;
  companyPhone?: string;
  supervisorName?: string;
  employeeRef?: string;
  requestedRoles: FunctionCode[];
};

type StaffStore = {
  user: StaffUser | null;
  jobs: Job[];
  log: LogEntry[];
  reports: StaffReport[];
  sync: SyncItem[];
  notices: StaffNotice[];
  qualifications: Qualification[];
  showAllJobs: boolean;
  tracking: "on" | "off" | "interrupted";
  biometric: boolean;
  notifyPush: boolean;
  notifySms: boolean;
  preview: (id: string) => void;
  login: (email: string, password: string) => { ok: true } | { ok: false; reason: string };
  logout: () => void;
  submitApplication: (input: ApplicationInput) => void;
  completeSetup: () => void;
  setRole: (code: FunctionCode) => void;
  setShowAllJobs: (value: boolean) => void;
  setTracking: (value: "on" | "off" | "interrupted") => void;
  setBiometric: (value: boolean) => void;
  setNotify: (patch: { push?: boolean; sms?: boolean }) => void;
  acknowledge: (id: string, problem?: string) => void;
  advance: (id: string, patch?: Partial<Job>) => void;
  addEvent: (id: string, type: string, source: Source, location: string, accuracy: string) => void;
  correctEvent: (jobId: string, eventId: string, reason: string, value: string) => void;
  addLog: (duty: string, body: string) => void;
  correctLog: (id: string, body: string, reason: string) => void;
  submitLog: () => void;
  logStatus: "Draft" | "Submitted" | "Approved" | "Returned for correction";
  logReturnReason: string;
  submitReport: (input: { category: string; body: string; jobId?: string; restrictedRoute: boolean }) => string;
  retrySync: (id: string) => "received" | "duplicate" | "conflict" | "waiting";
  uploadQualification: (name: string, code: FunctionCode, expires?: string) => void;
  updateQualification: (id: string, input: { name: string; code: FunctionCode; expires?: string }) => void;
  changePassword: (current: string, next: string) => { ok: true } | { ok: false; reason: string };
};

const Ctx = createContext<StaffStore | null>(null);

function sourceFor(user: StaffUser | null): Source {
  if (user?.workerType === "employee") return "Employee-entered";
  return "Contractor-entered";
}

export function StaffProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StaffUser[]>(DEMO_USERS);
  const [user, setUser] = useState<StaffUser | null>(() => {
    const id = readStorage("staff-session");
    return DEMO_USERS.find((item) => item.id === id) ?? null;
  });
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [log, setLog] = useState<LogEntry[]>(SEED_LOG);
  const [reports, setReports] = useState<StaffReport[]>(SEED_REPORTS);
  const [sync, setSync] = useState<SyncItem[]>(SEED_SYNC);
  const [qualifications, setQualifications] = useState<Qualification[]>(SEED_QUALS);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [tracking, setTracking] = useState<"on" | "off" | "interrupted">("off");
  const [biometric, setBiometric] = useState(false);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [logStatus, setLogStatus] = useState<StaffStore["logStatus"]>("Draft");
  const [logReturnReason] = useState("Fuel delivery quantity was missing from the afternoon entry.");

  const value = useMemo<StaffStore>(() => {
    const enter = (next: StaffUser | null) => {
      setUser(next);
      if (next) writeStorage("staff-session", next.id);
      else clearStorage("staff-session");
    };
    return {
      user,
      jobs,
      log,
      reports,
      sync,
      notices: SEED_NOTICES,
      qualifications: qualifications.filter((item) => !user || item.userId === user.id || item.userId === "st-dana"),
      showAllJobs,
      tracking,
      biometric,
      notifyPush,
      notifySms,
      logStatus,
      logReturnReason,
      preview: (id) => {
        const found = users.find((item) => item.id === id) ?? DEMO_USERS.find((item) => item.id === id);
        if (found) enter(found);
      },
      login: (email) => {
        const found = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
        const approved = users.find((item) => item.id === "st-dana") ?? DEMO_USERS.find((item) => item.id === "st-dana");
        enter(found ?? approved ?? users[0]);
        return { ok: true };
      },
      logout: () => enter(null),
      submitApplication: (input) => {
        const created: StaffUser = {
          id: `st-${Date.now()}`,
          fullName: input.fullName.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          password: input.password,
          workerType: input.workerType,
          companyName: input.companyName,
          requestedRoles: input.requestedRoles,
          approvedRoles: [],
          supervisorFlag: input.workerType === "supervisor",
          organization: "Pending SIH&S assignment",
          supervisor: "Not assigned",
          properties: [],
          memberSince: "—",
          status: "pending" satisfies AccountStatus,
          submittedAt: new Date().toISOString().slice(0, 10),
          setupDone: false,
          activeRole: input.requestedRoles[0] ?? "OFC",
        };
        setUsers((list) => [...list, created]);
        enter(null);
      },
      completeSetup: () => {
        if (!user) return;
        const next = { ...user, setupDone: true };
        setUser(next);
        setUsers((list) => list.map((item) => (item.id === next.id ? next : item)));
      },
      setRole: (code) => {
        if (!user || !user.approvedRoles.includes(code)) return;
        const next = { ...user, activeRole: code };
        setUser(next);
      },
      setShowAllJobs,
      setTracking,
      setBiometric,
      setNotify: (patch) => {
        if (patch.push !== undefined) setNotifyPush(patch.push);
        if (patch.sms !== undefined) setNotifySms(patch.sms);
      },
      acknowledge: (id, problem) => {
        setJobs((list) =>
          list.map((job) =>
            job.id === id
              ? {
                  ...job,
                  latestLabel: problem ? "Problem reported to dispatch" : "Acknowledgment sent",
                  latestSource: sourceFor(user),
                  status: problem ? "Needs Attention" : job.status,
                  missing: job.missing.filter((item) => item !== "Acknowledge assignment"),
                }
              : job,
          ),
        );
      },
      advance: (id, patch) => {
        setJobs((list) => list.map((job) => (job.id === id ? { ...job, ...patch } : job)));
      },
      addEvent: (id, type, source, location, accuracy) => {
        const now = new Date().toISOString();
        setJobs((list) =>
          list.map((job) =>
            job.id === id
              ? {
                  ...job,
                  latestLabel: type,
                  latestSource: source,
                  events: [
                    ...job.events,
                    { id: `ev-${Date.now()}`, type, source, at: now, receivedAt: now, location, accuracy },
                  ],
                }
              : job,
          ),
        );
      },
      correctEvent: (jobId, eventId, reason, value) => {
        const now = new Date().toISOString();
        setJobs((list) =>
          list.map((job) =>
            job.id !== jobId
              ? job
              : {
                  ...job,
                  events: job.events.map((event) =>
                    event.id !== eventId
                      ? event
                      : {
                          ...event,
                          original: event.original ?? event.type,
                          corrections: [
                            ...(event.corrections ?? []),
                            { author: user?.fullName ?? "Staff", reason, at: now, value },
                          ],
                        },
                  ),
                },
          ),
        );
      },
      addLog: (duty, body) => {
        setLog((list) => [
          {
            id: `L${Date.now()}`,
            duty,
            body,
            source: sourceFor(user),
            at: new Date().toISOString(),
            author: user?.fullName ?? "Staff",
          },
          ...list,
        ]);
      },
      correctLog: (id, body, reason) => {
        const original = log.find((item) => item.id === id);
        if (!original) return;
        setLog((list) => [
          {
            id: `L${Date.now()}`,
            duty: original.duty,
            body,
            source: sourceFor(user),
            at: new Date().toISOString(),
            author: user?.fullName ?? "Staff",
            correctionOf: id,
            reason,
          },
          ...list,
        ]);
      },
      submitLog: () => setLogStatus("Submitted"),
      submitReport: ({ category, body, jobId, restrictedRoute }) => {
        const id = `R-${Date.now().toString().slice(-4)}`;
        setReports((list) => [
          {
            id,
            category,
            body,
            at: new Date().toISOString(),
            status: "Received",
            restrictedRoute,
            updates: [],
            jobId,
          },
          ...list,
        ]);
        return id;
      },
      retrySync: (id) => {
        const item = sync.find((row) => row.id === id);
        if (!item) return "waiting";
        if (item.duplicate) return "duplicate";
        if (item.conflict) return "conflict";
        if (typeof navigator !== "undefined" && !navigator.onLine) return "waiting";
        setSync((list) => list.map((row) => (row.id === id ? { ...row, status: "Received" } : row)));
        return "received";
      },
      changePassword: (current, nextPassword) => {
        if (!user) return { ok: false as const, reason: "Sign in to change a password." };
        if (current !== user.password) return { ok: false as const, reason: "Current password is incorrect." };
        if (nextPassword.length < 8 || !/\d/.test(nextPassword)) {
          return { ok: false as const, reason: "Use at least 8 characters, including a number." };
        }
        const next = { ...user, password: nextPassword };
        setUser(next);
        setUsers((list) => list.map((item) => (item.id === next.id ? next : item)));
        return { ok: true as const };
      },
      uploadQualification: (name, code, expires) => {
        if (!user) return;
        setQualifications((list) => [
          {
            id: `q${Date.now()}`,
            userId: user.id,
            code,
            name,
            expires: expires || undefined,
            status: "Submitted—pending verification",
          },
          ...list,
        ]);
      },
      updateQualification: (id, input) => {
        setQualifications((list) =>
          list.map((item) =>
            item.id === id
              ? {
                  ...item,
                  code: input.code,
                  name: input.name,
                  expires: input.expires || undefined,
                  replaces: item.name,
                  status: "Submitted—pending verification",
                }
              : item,
          ),
        );
      },
    };
  }, [user, users, jobs, log, reports, sync, qualifications, showAllJobs, tracking, biometric, notifyPush, notifySms, logStatus, logReturnReason]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStaff() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStaff must be used inside StaffProvider");
  return ctx;
}
