/** Customer-facing defaults. Values marked TBC stay configurable and are not treated as final business rules. */
export const CUSTOMER_CONFIG = {
  statusLabels: {
    pending: "Request received—pending SIH&S confirmation.",
    accepted: "Accepted",
    scheduled: "Scheduled",
    inProgress: "In progress",
    underReview: "Under review",
    completed: "Completed",
    postponed: "Postponed",
    canceled: "Cancelled",
    updated: "Updated",
    followUp: "Follow-up in progress",
    paused: "Work paused",
    resumed: "Work resumed",
  },
  /** Customer-facing ETA and live tracking. Default OFF until SIH&S enables it. */
  showEta: false,
  /** Default: company name only. Worker identity is not shown. */
  workerIdentity: "SIH&S",
  videoMaxSeconds: 5,
  /** Notification channel toggles. Exact channels are not finalized. */
  notificationChannels: ["In-app", "SMS", "Email"] as const,
  approvalLimitMessage:
    "This request may exceed your approval limit. SIH&S will route it to an authorized person. Limit rules are not finalized.",
  cancellationMessage:
    "You can cancel a request before SIH&S accepts it. Refund eligibility is still determined under the Full Terms & Agreement.",
  propertyChangeMessage: "Change requests are sent to SIH&S for review. Approved property records are not overwritten here.",
  towingAuthMessage:
    "Private-property towing needs verified authorization. This request is marked Authorization pending verification and is not an approved tow.",
  documentCategories: ["Approved reports", "Job packets", "Receipts"] as const,
} as const;

export const PENDING_STATUS = CUSTOMER_CONFIG.statusLabels.pending;

export const REQUEST_STATUS_LABELS = {
  received: "Received—pending confirmation",
  "needs-input": "Needs your input",
  "deposit-required": "Confirmed—deposit required",
  confirmed: "Confirmed",
  scheduled: "Scheduled",
  assigned: "Assigned",
  "in-progress": "In progress",
  updated: "Updated",
  completed: "Completed",
  canceled: "Canceled",
  "cancellation-requested": "Cancellation requested—pending SIH&S confirmation.",
  "appointment-requested": "Appointment requested—pending SIH&S confirmation.",
  "authorization-pending": "Authorization pending verification.",
} as const;

export function customerStatusLabel(status: string, label?: string) {
  if (label) return label;
  if (status === "pending") return REQUEST_STATUS_LABELS.received;
  if (status === "ongoing") return REQUEST_STATUS_LABELS["in-progress"];
  if (status === "completed") return REQUEST_STATUS_LABELS.completed;
  if (status === "canceled") return REQUEST_STATUS_LABELS.canceled;
  if (status === "cancellation-requested") return REQUEST_STATUS_LABELS["cancellation-requested"];
  return status;
}

export const RESTRICTED_MEDIA_SLUGS = new Set(["drug-alcohol", "dna", "notary"]);
