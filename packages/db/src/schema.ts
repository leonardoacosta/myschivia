import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const campTypeEnum = pgEnum("camp_type", [
  "Art",
  "Sound",
  "Performance",
  "Dance",
  "Yoga",
  "Healing",
  "Fitness",
  "Workshop",
  "Misc",
  "Food",
  "Bar",
  "Tea or Coffee",
  "Chill",
  "Lounge",
  "Networking",
  "Gifting",
  "Storytelling",
  "First Aid",
]);

export const Camp = pgTable("camp", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  coordinates: varchar("coordinates"),

  name: varchar("name", { length: 256 }).notNull(),
  description: text("description").notNull(),
  image: text("image"),

  type: campTypeEnum("camp_type").notNull().default("Misc"),

  createdById: uuid("created_by_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const CreateCampSchema = createInsertSchema(Camp, {
  name: z.string().max(256),
  description: z.string().max(256),

  image: z.string().max(256).nullable(),

  type: z.enum(campTypeEnum.enumValues),
}).omit({
  id: true,
  coordinates: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
});
export const eventTypeEnum = pgEnum("event_type", [
  "Workshop",
  "Class",
  "Inclusion",
  "Fire",
  "Food",
  "Kid Friendly",
  "Games",
  "Gathering",
  "Music",
  "Mature Audiences",
  "Misc",
  "Parade",
  "Ritual",
  "Self Care",
  "Sustainability",
  "Yoga",
]);

export const Event = pgTable("event", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  location: varchar("location", { length: 256 }).notNull(),

  name: varchar("name", { length: 256 }).notNull(),
  description: text("description").notNull(),
  image: text("image"),

  startDate: timestamp("start_date").notNull(),
  startTime: varchar("start_time", { length: 20 }).notNull(),
  endDate: timestamp("end_date").notNull(),
  endTime: varchar("end_time", { length: 20 }).notNull(),

  type: eventTypeEnum("event_type").notNull().default("Misc"),

  createdById: uuid("created_by_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  campId: uuid("camp_id").references(() => Camp.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const CreateEventSchema = createInsertSchema(Event, {
  location: z.string().max(256),

  name: z.string().min(1).max(256),
  description: z.string().min(1).max(256),

  image: z.string().max(256).nullable(),

  type: z.enum(eventTypeEnum.enumValues),

  startDate: z.date(),
  startTime: z.string().max(20),
  endDate: z.date(),
  endTime: z.string().max(20),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
});

export const EventRelations = relations(Event, ({ one }) => ({
  user: one(User, { fields: [Event.createdById], references: [User.id] }),
  camp: one(Camp, { fields: [Event.campId], references: [Camp.id] }),
}));

export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  image: varchar("image", { length: 255 }),
});

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
  events: many(Event),
}));

export const Account = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = pgTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: timestamp("expires", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));
