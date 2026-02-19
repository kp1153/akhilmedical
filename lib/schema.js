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

export const sales = sqliteTable("sales", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  billNumber: text("bill_number").notNull(),
  patientId: integer("patient_id").references(() => patients.id),
  paymentType: text("payment_type").default("cash"),
  totalAmount: real("total_amount").notNull(),
  discountAmount: real("discount_amount").default(0),
  netAmount: real("net_amount").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const saleItems = sqliteTable("sale_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  saleId: integer("sale_id").references(() => sales.id),
  medicineId: integer("medicine_id").references(() => medicines.id),
  medicineName: text("medicine_name").notNull(),
  quantity: integer("quantity").notNull(),
  rate: real("rate").notNull(),
  discount: real("discount").default(0),
  amount: real("amount").notNull(),
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: integer("patient_id").references(() => patients.id),
  amount: real("amount").notNull(),
  method: text("method").default("cash"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});