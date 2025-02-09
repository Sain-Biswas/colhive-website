import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const organizations = sqliteTable("organizations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  logo: text("logo"),
  category: text("category", { enum: ["Enterprise", "Startup", "Free"] }),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});
