import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

import { projects } from "./projects";
import { teamMembers } from "./team-members";

export const teams = sqliteTable("teams", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  logo: text("logo"),
  identifier: text("identifier")
    .unique()
    .$defaultFn(() => ulid()),
  projectId: text("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
  projects: one(projects, {
    fields: [teams.projectId],
    references: [projects.id],
  }),
  members: many(teamMembers),
}));
