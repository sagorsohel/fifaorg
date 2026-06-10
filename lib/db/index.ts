import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import * as schema from "./schema"
import { sql } from "drizzle-orm"

const poolConnection = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "world_cup_2026",
  port: Number(process.env.MYSQL_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000,
})

export const db = drizzle(poolConnection, { schema, mode: "default" })

let tablesEnsured = false

export async function ensureTablesExist() {
  if (tablesEnsured) return
  try {
    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS \`teams\` (
        \`id\` varchar(50) PRIMARY KEY,
        \`_id\` varchar(50) NOT NULL,
        \`name_en\` varchar(100) NOT NULL,
        \`name_fa\` varchar(100),
        \`flag\` varchar(255),
        \`fifa_code\` varchar(10),
        \`iso2\` varchar(10),
        \`groups\` varchar(10),
        \`translations\` text
      )
    `)

    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS \`stadiums\` (
        \`id\` varchar(50) PRIMARY KEY,
        \`_id\` varchar(50) NOT NULL,
        \`name_en\` varchar(100) NOT NULL,
        \`name_fa\` varchar(100),
        \`fifa_name\` varchar(150),
        \`city_en\` varchar(100),
        \`city_fa\` varchar(100),
        \`country_en\` varchar(100),
        \`country_fa\` varchar(100),
        \`capacity\` int,
        \`region\` varchar(100),
        \`translations\` text
      )
    `)

    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS \`games\` (
        \`id\` varchar(50) PRIMARY KEY,
        \`_id\` varchar(50) NOT NULL,
        \`home_team_id\` varchar(50) NOT NULL,
        \`away_team_id\` varchar(50) NOT NULL,
        \`home_score\` varchar(10) DEFAULT '0',
        \`away_score\` varchar(10) DEFAULT '0',
        \`home_scorers\` text,
        \`away_scorers\` text,
        \`group\` varchar(10),
        \`matchday\` varchar(50),
        \`local_date\` varchar(100),
        \`persian_date\` varchar(100),
        \`stadium_id\` varchar(50),
        \`finished\` varchar(10) DEFAULT 'FALSE',
        \`time_elapsed\` varchar(50),
        \`type\` varchar(50),
        \`slug\` varchar(150) UNIQUE NOT NULL,
        \`referral_link\` text,
        \`modal_image\` text,
        \`bg_image\` text
      )
    `)

    // Self-healing columns for existing tables
    try {
      await poolConnection.query("ALTER TABLE `teams` ADD COLUMN `translations` TEXT NULL")
    } catch (err) {
      // Ignore if column already exists
    }

    try {
      await poolConnection.query("ALTER TABLE `stadiums` ADD COLUMN `translations` TEXT NULL")
    } catch (err) {
      // Ignore if column already exists
    }

    try {
      await poolConnection.query("ALTER TABLE `games` ADD COLUMN `referral_link` TEXT NULL")
    } catch (err) {}

    try {
      await poolConnection.query("ALTER TABLE `games` ADD COLUMN `modal_image` TEXT NULL")
    } catch (err) {}

    try {
      await poolConnection.query("ALTER TABLE `games` ADD COLUMN `bg_image` TEXT NULL")
    } catch (err) {}

    tablesEnsured = true
    console.log("Database tables verified/created successfully.")
  } catch (err) {
    console.error("Failed to ensure database tables exist:", err)
    throw err
  }
}
