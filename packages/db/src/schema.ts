import { relations, sql } from "drizzle-orm";
import {
  boolean,
  decimal,
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

// * Roles
export const Role = pgEnum("role", ["God", "Lead", "Participant"]);

// * Burn ===
export const Burn = pgTable("burn", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  name: varchar("name", { length: 256 }).notNull(),
  description: text("description").notNull(),
  image: text("image"),

  approved: boolean("approved").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const BurnYear = pgTable("burn_year", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  burnId: uuid("burn_id")
    .notNull()
    .references(() => Burn.id, {
      onDelete: "no action",
    }),

  name: varchar("name", { length: 256 }),
  description: text("description"),
  image: text("image"),

  coordinates: text("coordinates"),

  startDate: timestamp("start_date").notNull(),
  startTime: varchar("start_time", { length: 20 }).notNull(),
  endDate: timestamp("end_date").notNull(),
  endTime: varchar("end_time", { length: 20 }).notNull(),

  // * Settings
  campRegistration: boolean("camp_registration").default(false),
  campRegistrationDeadline: timestamp("camp_registration_deadline"),

  campRegistrationEditing: boolean("camp_registration_editing").default(false),

  volunteerManagement: boolean("volunteer_registration").default(false),
  volunteerManagementEditing: boolean("volunteer_registration_editing").default(
    false,
  ),

  eventRegistration: boolean("event_registration").default(false),
  eventEditing: boolean("event_editing").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export type BurnType = typeof Burn.$inferSelect & {
  years: BurnYearType[];
};
export type BurnYearType = typeof BurnYear.$inferSelect & {
  burn: BurnType;
};

export const CreateBurnSchema = createInsertSchema(Burn, {
  name: z.string().max(256),
  description: z.string().max(256),

  image: z.string().max(256).nullable(),
}).omit({
  id: true,
  approved: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateBurnYearSchema = createInsertSchema(BurnYear, {
  name: z.string().max(256),
  description: z.string().max(256),

  image: z.string().max(256).nullable(),

  coordinates: z
    .string()
    .max(256)
    .nullable()
    .refine(
      (value) => {
        if (!value) return true;

        const [lat, lng] = value.split(",");

        // * Check if lat and lng exist
        if (!lat) {
          console.log("lat missing");
          return false;
        } else if (!lng) {
          console.log("lng missing");
          return false;
        }

        console.log(lat, parseFloat(lat), isNaN(parseFloat(lat)));

        console.log(lng, parseFloat(lng), isNaN(parseFloat(lng)));

        // * Check if lat and lng are numbers
        if (isNaN(parseFloat(lat))) {
          console.log("lat not a number");
          return false;
        } else if (isNaN(parseFloat(lng))) {
          console.log("lng not a number");
          return false;
        }
        return true;
      },
      {
        message: "Invalid coordinates",
      },
    ),

  startDate: z.coerce.date(),
  startTime: z.string().max(20),
  endDate: z.coerce.date(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  burnId: true,
});

export const CreateBurnWithYearSchema = z.object({
  burn: CreateBurnSchema,
  burnYear: CreateBurnYearSchema,
});

export const UpdateBurnSchema = createInsertSchema(Burn, {
  id: z.string().max(256),
  name: z.string().max(256),
  description: z.string().max(256),

  image: z.string().max(256).nullable(),
}).omit({
  updatedAt: true,
});

// * Camps ===
export const Tag = pgEnum("camp_tag", [
  "Food",
  "Games",
  "Bar",
  "Tea or Coffee (non-alcoholic)",
  "Sound",
  "Dance",
  "Chill",
  "Lounge",
  "Interactive",
  "Performance",
  "Screening",
  "Transport",
  "Storytelling",
  "Service",
  "Self Expression",
  "Art",
  "Yoga",
  "Healing",
  "Fitness",
  "Workshop",
  "Misc",
  "Networking",
  "Gifting",
  "First Aid",
  "Kink",
]);

export const Camp = pgTable("camp", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  name: varchar("name", { length: 256 }).notNull(),
  slogan: varchar("slogan", { length: 256 }).default(""),
  description: text("description"),
  image: text("image"),

  createdById: uuid("created_by_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});
export type Camp = typeof Camp.$inferSelect;

export const Camp_Tag = pgTable("camp_tags", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  campId: uuid("camp_id")
    .notNull()
    .references(() => Camp.id, { onDelete: "cascade" }),
  tag: Tag("tag").notNull().default("Misc"),
});

export const CampTagRelations = relations(Camp_Tag, ({ one }) => ({
  camps: one(Camp, { fields: [Camp_Tag.campId], references: [Camp.id] }),
}));

export const CampRegistration = pgTable("camp_registration", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  campId: uuid("camp_id")
    .notNull()
    .references(() => Camp.id, { onDelete: "cascade" }),
  approved: boolean("approved").default(false),
  burnYearId: uuid("burn_year_id").references(() => BurnYear.id, {
    onDelete: "no action",
  }),
});

export const CreateCampSchema = createInsertSchema(Camp, {
  name: z.string().max(256),
  slogan: z.string().max(256),
  description: z.string().max(256),

  image: z.string().max(256).nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
});

export const UpdateCampSchema = createInsertSchema(Camp, {
  id: z.string().max(256),

  name: z.string().min(1).max(256),
  slogan: z.string().max(256),
  description: z.string(),

  image: z.string().max(256).nullable(),

  createdAt: z.coerce.date(),
  createdById: z.string().max(256),
}).omit({
  updatedAt: true,
});

// * Events ===
export const EventType = pgEnum("event_type", [
  // "Interactive",
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
  image: text("image").notNull(),

  mature: boolean("mature").default(false),

  startDate: timestamp("start_date").notNull(),
  startTime: varchar("start_time", { length: 20 }).notNull(),
  endDate: timestamp("end_date").notNull(),
  endTime: varchar("end_time", { length: 20 }).notNull(),

  type: EventType("event_type").notNull().default("Misc"),

  createdById: uuid("created_by_id").references(() => User.id, {
    onDelete: "cascade",
  }),
  hostName: varchar("host_name", { length: 256 }).default("").notNull(),
  campName: varchar("camp_name", { length: 256 }).default("").notNull(),
  campId: uuid("camp_id").references(() => Camp.id, { onDelete: "no action" }),
  burnYearId: uuid("burn_year_id").references(() => BurnYear.id, {
    onDelete: "no action",
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const Favorite = pgTable("favorite", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  eventId: uuid("event_id")
    .notNull()
    .references(() => Event.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});
export const FavoriteRelations = relations(Favorite, ({ one }) => ({
  event: one(Event, { fields: [Favorite.eventId], references: [Event.id] }),
  user: one(User, { fields: [Favorite.userId], references: [User.id] }),
}));

export const EventRelations = relations(Event, ({ one }) => ({
  user: one(User, { fields: [Event.createdById], references: [User.id] }),
  camp: one(Camp, { fields: [Event.campId], references: [Camp.id] }),
  burnYear: one(BurnYear, {
    fields: [Event.burnYearId],
    references: [BurnYear.id],
  }),
}));

export const CreateEventSchema = createInsertSchema(Event, {
  location: z.string().max(256),

  name: z.string().min(1).max(256),
  description: z.string(),

  image: z.string().max(256),

  type: z.enum(EventType.enumValues),
  burnYearId: z.string().max(256).nullable(),
  campName: z.string().max(256),
  mature: z.boolean().default(false).optional(),
  campId: z.string().max(256).nullable(),

  hostName: z.string().max(256).optional(),

  startDate: z.coerce.date(),
  startTime: z.string().max(20),
  endDate: z.coerce.date(),
  endTime: z.string().max(20),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
});

export const UpdateEventSchema = createInsertSchema(Event, {
  id: z.string().max(256),
  location: z.string().max(256),

  name: z.string().min(1).max(256),
  description: z.string().min(1).max(256),

  type: z.enum(EventType.enumValues),
  burnYearId: z.string().max(256).nullable(),
  campName: z.string().max(256),
  mature: z.boolean().default(false).optional(),
  campId: z.string().max(256).nullable(),

  startDate: z.coerce.date(),
  startTime: z.string().max(20),
  endDate: z.coerce.date(),
  endTime: z.string().max(20),

  createdAt: z.coerce.date(),
  createdById: z.string().max(256),
}).omit({
  updatedAt: true,
});

// * Zones ===
export const ZoneType = pgEnum("zone_type", [
  "Polygon",
  "Point",
  "LineString",
  "MultiPoint",
  "MultiLineString",
  "MultiPolygon",
  "GeometryCollection",
]);

export const ZoneClass = pgEnum("zone_class", ["Camp", "RV", "Road", "Path"]);
export enum ZoneClassEnum {
  Camp = "Camp",
  RV = "RV",
  Road = "Road",
  Path = "Path",
}

export const Zone = pgTable("zone", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  type: ZoneType("type").notNull().default("Point"),
  class: ZoneClass("class"),
  color: varchar("color", { length: 7 }),

  radius: decimal("radius", { precision: 10, scale: 6 }),
  description: text("description").default(""),
  campId: uuid("campId").references(() => Camp.id, { onDelete: "no action" }),
  burnYear: uuid("burn_year_id").references(() => BurnYear.id, {
    onDelete: "no action",
  }),

  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const UpdateZoneSchema = createInsertSchema(Zone, {
  id: z.string().max(256),
  type: z.enum(ZoneType.enumValues),
  radius: z.number().nullable(),
  description: z.string(),
  campId: z.string().optional(),
  burnYear: z.string().optional(),
}).omit({
  updatedAt: true,
});

export const Coordinate = pgTable("coordinate", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  zoneId: uuid("zoneId")
    .notNull()
    .references(() => Zone.id, { onDelete: "cascade" }),
  lat: decimal("lat", { precision: 10, scale: 6 }).notNull(),
  lng: decimal("lng", { precision: 10, scale: 6 }).notNull(),
  index: integer("index").default(0).notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const CoordinateRelations = relations(Coordinate, ({ one }) => ({
  zone: one(Zone, { fields: [Coordinate.zoneId], references: [Zone.id] }),
}));

export const ZoneRelations = relations(Zone, ({ many, one }) => ({
  coordinates: many(Coordinate),
  camp: one(Camp, { fields: [Zone.campId], references: [Camp.id] }),
  burnYear: one(BurnYear, {
    fields: [Zone.burnYear],
    references: [BurnYear.id],
  }),
}));

// * Users ===
export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  alias: varchar("alias", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  image: varchar("image", { length: 255 }),
});

// * Member ===
export const CampMembership = pgTable("camp_membership", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  campId: uuid("campId")
    .notNull()
    .references(() => Camp.id, { onDelete: "cascade" }),
});

export const CampRelations = relations(Camp, ({ one, many }) => ({
  createdBy: one(User, { fields: [Camp.createdById], references: [User.id] }),
  campMembership: many(CampMembership),
  tags: many(Camp_Tag),
}));

export const CampRegistrationRelations = relations(
  CampRegistration,
  ({ one, many }) => ({
    camp: one(Camp, {
      fields: [CampRegistration.campId],
      references: [Camp.id],
    }),
    burnYear: one(BurnYear, {
      fields: [CampRegistration.burnYearId],
      references: [BurnYear.id],
    }),
  }),
);

export const UsersToBurnYear = pgTable("user_to_burn_year", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id),
  burnYearId: uuid("burn_year_id")
    .notNull()
    .references(() => BurnYear.id),
});

export const UserBurnYearRoles = pgTable("user_burn_year_roles", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userBurnYear: uuid("user_burn_year")
    .notNull()
    .references(() => UsersToBurnYear.id, { onDelete: "cascade" }),
  role: Role("role").notNull().default("Participant"),
});

export const UsersToBurnYearRelations = relations(
  UsersToBurnYear,
  ({ one, many }) => ({
    user: one(User, {
      fields: [UsersToBurnYear.userId],
      references: [User.id],
    }),
    burnYear: one(BurnYear, {
      fields: [UsersToBurnYear.burnYearId],
      references: [BurnYear.id],
    }),
    roles: many(UserBurnYearRoles),
  }),
);

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
  events: many(Event),
  camps: many(Camp),
  burns: many(UsersToBurnYear),
  campMemberships: many(CampMembership),
  schedule: many(Favorite),
}));

export const BurnYearRelations = relations(BurnYear, ({ many, one }) => ({
  members: many(UsersToBurnYear),
  events: many(Event),
  camps: many(Camp),
  burn: one(Burn, { fields: [BurnYear.burnId], references: [Burn.id] }),
}));

export const UpdateBurnYearSchema = createInsertSchema(BurnYear, {
  id: z.string().max(256),

  name: z.string().min(1).max(256),
  description: z.string().min(1).max(256),
  image: z.string().max(256).nullable(),

  coordinates: z
    .string()
    .max(256)
    .nullable()
    .refine(
      (value) => {
        if (!value) return true;

        const [lat, lng] = value.split(",");

        // * Check if lat and lng exist
        if (!lat) {
          console.log("lat missing");
          return false;
        } else if (!lng) {
          console.log("lng missing");
          return false;
        }

        console.log(lat, parseFloat(lat), isNaN(parseFloat(lat)));

        console.log(lng, parseFloat(lng), isNaN(parseFloat(lng)));

        // * Check if lat and lng are numbers
        if (isNaN(parseFloat(lat))) {
          console.log("lat not a number");
          return false;
        } else if (isNaN(parseFloat(lng))) {
          console.log("lng not a number");
          return false;
        }
        return true;
      },
      {
        message: "Invalid coordinates",
      },
    ),

  startDate: z.coerce.date(),
  startTime: z.string().max(20),
  endDate: z.coerce.date(),
  endTime: z.string().max(20),

  campRegistration: z.boolean().default(false),
  campRegistrationDeadline: z.coerce.date().nullable(),
  campRegistrationEditing: z.boolean().default(false),

  volunteerManagement: z.boolean().default(false),
  volunteerManagementEditing: z.boolean().default(false),

  eventRegistration: z.boolean().default(false),
  eventEditing: z.boolean().default(false),
}).omit({
  burnId: true,
  createdAt: true,
  updatedAt: true,
});

export const BurnRelations = relations(Burn, ({ many }) => ({
  years: many(BurnYear),
}));

export const UpdateUserSchema = createInsertSchema(User, {
  id: z.string().max(256),

  name: z.string().min(1).max(256),
  alias: z.string().min(1).max(256),
  email: z.string().email().max(256),
  emailVerified: z.coerce.date(),
  image: z.string().max(256).nullable(),
});

// * Accounts ===
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
