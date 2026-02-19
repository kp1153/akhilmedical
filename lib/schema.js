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

export const medicines = sqliteTable("medicines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  company: text("company"),
  batch: text("batch"),
  expiry: text("expiry"),
  mrp: real("mrp"),
  purchasePrice: real("purchase_price"),
  salePrice: real("sale_price"),
  stock: integer("stock").default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: integer("patient_id").references(() => patients.id),
  medicineId: integer("medicine_id").references(() => medicines.id),
  description: text("description"),
  amount: real("amount").notNull(),
  quantity: integer("quantity").default(1),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: integer("patient_id").references(() => patients.id),
  amount: real("amount").notNull(),
  method: text("method").default("cash"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});