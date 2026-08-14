export const RENEWAL_PERIODS = [
  "MONTHLY",
  "QUARTERLY",
  "SEMI_ANNUAL",
  "ANNUAL",
  "CUSTOM",
] as const;
export type RenewalPeriod = (typeof RENEWAL_PERIODS)[number];

export const EXTINGUISHER_TYPES = [
  "ABC_DRY_CHEMICAL",
  "CO2",
  "WATER",
  "FOAM",
  "WET_CHEMICAL",
  "CLASS_D",
  "OTHER",
] as const;
export type ExtinguisherType = (typeof EXTINGUISHER_TYPES)[number];

export const UNIT_STATUSES = ["ACTIVE", "DUE_SOON", "EXPIRED"] as const;
export type UnitStatus = (typeof UNIT_STATUSES)[number];

export const USER_ROLES = ["ADMIN", "CLIENT"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const RENEWAL_PERIOD_LABELS: Record<RenewalPeriod, string> = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  SEMI_ANNUAL: "Every 6 months",
  ANNUAL: "Annual",
  CUSTOM: "Custom",
};

export const EXTINGUISHER_TYPE_LABELS: Record<ExtinguisherType, string> = {
  ABC_DRY_CHEMICAL: "ABC Dry Chemical",
  CO2: "CO2",
  WATER: "Water",
  FOAM: "Foam",
  WET_CHEMICAL: "Wet Chemical",
  CLASS_D: "Class D",
  OTHER: "Other",
};

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  ACTIVE: "Active",
  DUE_SOON: "Due Soon",
  EXPIRED: "Expired",
};
