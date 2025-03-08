import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { organizations } from "./organizations";
import { users } from "./user";

export const invitations = sqliteTable("invitations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email")
    .notNull()
    .references(() => users.email, { onDelete: "cascade" }),
  inviterId: text("inviterId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
  role: text("role", { enum: ["owner", "admin", "member"] })
    .notNull()
    .$defaultFn(() => "member"),
  status: text("status", {
    enum: ["pending", "accepted", "rejected", "canceled"],
  })
    .notNull()
    .$defaultFn(() => "pending"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const invitationRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  sentTo: one(users, {
    fields: [invitations.email],
    references: [users.email],
  }),
  sentFrom: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
  }),
}));
