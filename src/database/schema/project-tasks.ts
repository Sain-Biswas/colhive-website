import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

import { organizations } from "./organizations";
import { projects } from "./projects";
import { users } from "./user";

export const projectTasks = sqliteTable("project-tasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  identifier: text("indentifier").$defaultFn(() => ulid()),
  projectId: text("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assignedBy: text("assignedBy")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  tag: text("tag", {
    enum: [
      "documentation",
      "bug",
      "fix",
      "feature",
      "chore",
      "refactor",
      "build",
      "test",
    ],
  }).notNull(),
  status: text("status", {
    enum: ["backlog", "todo", "in-progress", "done", "canceled"],
  }).notNull(),
  priority: text("priority", { enum: ["high", "medium", "high"] }).notNull(),
  title: text("title").notNull(),
});

export const projectTasksRelations = relations(projectTasks, ({ one }) => ({
  organization: one(organizations, {
    fields: [projectTasks.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [projectTasks.userId],
    references: [users.id],
  }),
  assignedBy: one(users, {
    fields: [projectTasks.assignedBy],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [projectTasks.projectId],
    references: [projects.id],
  }),
}));
