import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const patients = sqliteTable("patients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  mobile: text("mobile"),
  address: text("address"),
  customerType: text("customer_type").default("retail"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: integer("patient_id").references(() => patients.id),
  description: text("description"),
  amount: real("amount").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: integer("patient_id").references(() => patients.id),
  amount: real("amount").notNull(),
  method: text("method").default("cash"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});