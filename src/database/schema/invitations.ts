import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { organizations } from "./organizations";
import { users } from "./user";

export const invitations = sqliteTable("invitations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email")
    .notNull()
    .references(() => users.email),
  inviterId: text("inviterId").references(() => users.id),
  organizationId: text("organizationId").references(() => organizations.id),
  role: text("role", { enum: ["owner", "admin", "manager", "member"] }),
  status: text("status", { enum: ["pending", "accepted", "rejected"] }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});
