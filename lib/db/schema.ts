import {
  boolean,
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  fullName: varchar("full_name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["super_admin", "admin", "surveyor", "finance"])
    .notNull()
    .default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: datetime("last_login_at"),
  createdAt: datetime("created_at").notNull(),
  updatedAt: datetime("updated_at").notNull(),
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  expiresAt: datetime("expires_at").notNull(),
  createdAt: datetime("created_at").notNull(),
});

export const loginAttempts = mysqlTable("login_attempts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  attemptKey: varchar("attempt_key", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 191 }).notNull(),
  ipAddress: varchar("ip_address", { length: 64 }).notNull(),
  failedCount: int("failed_count").notNull().default(0),
  firstFailedAt: datetime("first_failed_at").notNull(),
  lastFailedAt: datetime("last_failed_at").notNull(),
  lockedUntil: datetime("locked_until"),
  createdAt: datetime("created_at").notNull(),
  updatedAt: datetime("updated_at").notNull(),
});

export const containers = mysqlTable("containers", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Survey details
  customer: varchar("customer", { length: 191 }).notNull(),
  typeSurvey: mysqlEnum("type_survey", ["In-serv", "ONH", "OFH", "Sale"]).notNull(),
  status: mysqlEnum("status", ["Mty", "Full"]).notNull(),
  condition: mysqlEnum("condition", ["DMG", "AVL", "AR"]).notNull(),
  cleanliness: mysqlEnum("cleanliness", ["dty", "ctm"]).notNull(),
  surveyLocation: varchar("survey_location", { length: 255 }).notNull(),
  dateSurvey: datetime("date_survey").notNull(),

  // Container identity / spec
  containerNumber: varchar("container_number", { length: 32 }).notNull().unique(),
  size: int("size").notNull(),
  dateManufactured: datetime("date_manufactured").notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  csc: varchar("csc", { length: 64 }).notNull(),
  mgm: varchar("mgm", { length: 64 }).notNull(),
  acep: varchar("acep", { length: 64 }).notNull(),
  payload: int("payload").notNull(),
  tct: varchar("tct", { length: 64 }).notNull(),
  tare: int("tare").notNull(),
  cuCap: int("cu_cap").notNull(),

  surveyorId: varchar("surveyor_id", { length: 36 }),
  note: varchar("note", { length: 2000 }),
  thirdSctySys: varchar("third_scty_sys", { length: 191 }),

  createdAt: datetime("created_at").notNull(),
  updatedAt: datetime("updated_at").notNull(),
  deletedAt: datetime("deleted_at"),
});

export const documentContainerSideEnum = [
  "rear",
  "front",
  "left_side",
  "right_side",
  "roof",
  "floor",
  "understructure",
] as const;

export const documentContainers = mysqlTable("document_containers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  containerId: varchar("container_id", { length: 36 }).notNull(),
  side: mysqlEnum("side", documentContainerSideEnum).notNull(),
  sectionH: varchar("section_h", { length: 1 }).notNull(),
  sectionV: varchar("section_v", { length: 1 }).notNull(),
  combinedSection: varchar("combined_section", { length: 16 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  status: mysqlEnum("status", ["Pending", "Processing", "Approved", "Rejected"])
    .notNull()
    .default("Pending"),
  uploadedById: varchar("uploaded_by_id", { length: 36 }).notNull(),
  reviewedById: varchar("reviewed_by_id", { length: 36 }),
  reviewedAt: datetime("reviewed_at"),
  createdAt: datetime("created_at").notNull(),
  updatedAt: datetime("updated_at").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type LoginAttempt = typeof loginAttempts.$inferSelect;
export type Container = typeof containers.$inferSelect;
export type NewContainer = typeof containers.$inferInsert;
export type DocumentContainer = typeof documentContainers.$inferSelect;
export type NewDocumentContainer = typeof documentContainers.$inferInsert;
