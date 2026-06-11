import { mysqlTable, varchar, int, text, double } from "drizzle-orm/mysql-core"

export const teams = mysqlTable("teams", {
  id: varchar("id", { length: 50 }).primaryKey(),
  _id: varchar("_id", { length: 50 }).notNull(),
  name_en: varchar("name_en", { length: 100 }).notNull(),
  name_fa: varchar("name_fa", { length: 100 }),
  flag: varchar("flag", { length: 255 }),
  fifa_code: varchar("fifa_code", { length: 10 }),
  iso2: varchar("iso2", { length: 10 }),
  groups: varchar("groups", { length: 10 }),
  translations: text("translations"),
  fifa_team_id: varchar("fifa_team_id", { length: 50 }),
  mp: int("mp").default(0),
  w: int("w").default(0),
  l: int("l").default(0),
  d: int("d").default(0),
  pts: int("pts").default(0),
  gf: int("gf").default(0),
  ga: int("ga").default(0),
  gd: int("gd").default(0),
})

export const players = mysqlTable("players", {
  id: varchar("id", { length: 50 }).primaryKey(),
  team_id: varchar("team_id", { length: 50 }).notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  jersey_num: int("jersey_num"),
  position: varchar("position", { length: 100 }),
  weight: double("weight"),
  height: double("height"),
  picture_url: varchar("picture_url", { length: 255 }),
  fifa_id: varchar("fifa_id", { length: 50 }),
})


export const stadiums = mysqlTable("stadiums", {
  id: varchar("id", { length: 50 }).primaryKey(),
  _id: varchar("_id", { length: 50 }).notNull(),
  name_en: varchar("name_en", { length: 100 }).notNull(),
  name_fa: varchar("name_fa", { length: 100 }),
  fifa_name: varchar("fifa_name", { length: 150 }),
  city_en: varchar("city_en", { length: 100 }),
  city_fa: varchar("city_fa", { length: 100 }),
  country_en: varchar("country_en", { length: 100 }),
  country_fa: varchar("country_fa", { length: 100 }),
  capacity: int("capacity"),
  region: varchar("region", { length: 100 }),
  translations: text("translations"),
})

export const games = mysqlTable("games", {
  id: varchar("id", { length: 50 }).primaryKey(),
  _id: varchar("_id", { length: 50 }).notNull(),
  home_team_id: varchar("home_team_id", { length: 50 }).notNull(),
  away_team_id: varchar("away_team_id", { length: 50 }).notNull(),
  home_score: varchar("home_score", { length: 10 }).default("0"),
  away_score: varchar("away_score", { length: 10 }).default("0"),
  home_scorers: text("home_scorers"),
  away_scorers: text("away_scorers"),
  group: varchar("group", { length: 10 }),
  matchday: varchar("matchday", { length: 50 }),
  local_date: varchar("local_date", { length: 100 }),
  persian_date: varchar("persian_date", { length: 100 }),
  stadium_id: varchar("stadium_id", { length: 50 }),
  finished: varchar("finished", { length: 10 }).default("FALSE"),
  time_elapsed: varchar("time_elapsed", { length: 50 }),
  type: varchar("type", { length: 50 }),
  slug: varchar("slug", { length: 150 }).unique().notNull(),
  referral_link: text("referral_link"),
  modal_image: text("modal_image"),
  bg_image: text("bg_image"),
})

export const ads = mysqlTable("ads", {
  id: varchar("id", { length: 50 }).primaryKey(),
  hero_ads: text("hero_ads"),
  hero2_ads: text("hero2_ads"),
  modal_ads: text("modal_ads"),
  header_ads: text("header_ads"),
  membership_ref_link: text("membership_ref_link"),
  signin_ref_link: text("signin_ref_link"),
})

