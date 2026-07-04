import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import * as schema from "./schema"
import { sql } from "drizzle-orm"

// Prevent multiple instances of pool in development
const globalForMysql = global as unknown as { poolConnection: mysql.Pool | undefined }

export const poolConnection = globalForMysql.poolConnection || mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
  waitForConnections: true,
  connectionLimit: 10,  queueLimit: 0,
  connectTimeout: 5000,
})

if (process.env.NODE_ENV !== "production") {
  globalForMysql.poolConnection = poolConnection
}

export const db = drizzle(poolConnection, { schema, mode: "default" })

let ensureTablesPromise: Promise<void> | null = null

export function ensureTablesExist(): Promise<void> {
  if (ensureTablesPromise) return ensureTablesPromise

  ensureTablesPromise = (async () => {
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
          \`translations\` text,
          \`fifa_team_id\` varchar(50),
          \`mp\` int DEFAULT 0,
          \`w\` int DEFAULT 0,
          \`l\` int DEFAULT 0,
          \`d\` int DEFAULT 0,
          \`pts\` int DEFAULT 0,
          \`gf\` int DEFAULT 0,
          \`ga\` int DEFAULT 0,
          \`gd\` int DEFAULT 0
        )
      `)

      await poolConnection.query(`
        CREATE TABLE IF NOT EXISTS \`players\` (
          \`id\` varchar(50) PRIMARY KEY,
          \`team_id\` varchar(50) NOT NULL,
          \`name\` varchar(150) NOT NULL,
          \`jersey_num\` int,
          \`position\` varchar(100),
          \`weight\` double,
          \`height\` double,
          \`picture_url\` varchar(255),
          \`fifa_id\` varchar(50)
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

      await poolConnection.query(`
        CREATE TABLE IF NOT EXISTS \`ads\` (
          \`id\` varchar(50) PRIMARY KEY,
          \`hero_ads\` text,
          \`hero2_ads\` text,
          \`modal_ads\` text,
          \`header_ads\` text,
          \`membership_ref_link\` text,
          \`signin_ref_link\` text,
          \`global_bg\` text
        )
      `)

      try {
        await poolConnection.query("INSERT IGNORE INTO `ads` (`id`, `hero_ads`, `hero2_ads`, `modal_ads`, `header_ads`, `membership_ref_link`, `signin_ref_link`, `global_bg`) VALUES ('global', '', '', '', '', '', '', '')")
      } catch (err) {}

      try {
        await poolConnection.query("ALTER TABLE `ads` ADD COLUMN `hero2_ads` TEXT NULL")
      } catch (err) {}

      try {
        await poolConnection.query("ALTER TABLE `ads` ADD COLUMN `membership_ref_link` TEXT NULL")
      } catch (err) {}

      try {
        await poolConnection.query("ALTER TABLE `ads` ADD COLUMN `signin_ref_link` TEXT NULL")
      } catch (err) {}

      try {
        await poolConnection.query("ALTER TABLE `ads` ADD COLUMN `global_bg` TEXT NULL")
      } catch (err) {}


      // Self-healing columns for existing tables
      try {
        await poolConnection.query("ALTER TABLE `teams` ADD COLUMN `fifa_team_id` VARCHAR(50) NULL")
      } catch (err) {}

      try {
        await poolConnection.query("ALTER TABLE `teams` ADD COLUMN `translations` TEXT NULL")
      } catch (err) {
        // Ignore if column already exists
      }

      try {
        await poolConnection.query("ALTER TABLE `teams` ADD COLUMN `mp` INT DEFAULT 0")
      } catch (err) {}
      try {
        await poolConnection.query("ALTER TABLE `teams` ADD COLUMN `w` INT DEFAULT 0")
      } catch (err) {}
      try {
        await poolConnection.query("ALTER TABLE `teams` ADD COLUMN `l` INT DEFAULT 0")
      } catch (err) {}
      try {
        await poolConnection.query("ALTER TABLE `teams` ADD COLUMN `d` INT DEFAULT 0")
      } catch (err) {}
      try {
        await poolConnection.query("ALTER TABLE `teams` ADD COLUMN `pts` INT DEFAULT 0")
      } catch (err) {}
      try {
        await poolConnection.query("ALTER TABLE `teams` ADD COLUMN `gf` INT DEFAULT 0")
      } catch (err) {}
      try {
        await poolConnection.query("ALTER TABLE `teams` ADD COLUMN `ga` INT DEFAULT 0")
      } catch (err) {}
      try {
        await poolConnection.query("ALTER TABLE `teams` ADD COLUMN `gd` INT DEFAULT 0")
      } catch (err) {}

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

      // Self-heal localhost/127.0.0.1 absolute URLs in games and players tables to relative paths
      try {
        await poolConnection.query(`
          UPDATE \`games\` 
          SET \`modal_image\` = REPLACE(\`modal_image\`, 'http://localhost:3000', '')
          WHERE \`modal_image\` LIKE 'http://localhost:3000%'
        `)
        await poolConnection.query(`
          UPDATE \`games\` 
          SET \`bg_image\` = REPLACE(\`bg_image\`, 'http://localhost:3000', '')
          WHERE \`bg_image\` LIKE 'http://localhost:3000%'
        `)
        await poolConnection.query(`
          UPDATE \`players\` 
          SET \`picture_url\` = REPLACE(\`picture_url\`, 'http://localhost:3000', '')
          WHERE \`picture_url\` LIKE 'http://localhost:3000%'
        `)

        await poolConnection.query(`
          UPDATE \`games\` 
          SET \`modal_image\` = REPLACE(\`modal_image\`, 'https://localhost:3000', '')
          WHERE \`modal_image\` LIKE 'https://localhost:3000%'
        `)
        await poolConnection.query(`
          UPDATE \`games\` 
          SET \`bg_image\` = REPLACE(\`bg_image\`, 'https://localhost:3000', '')
          WHERE \`bg_image\` LIKE 'https://localhost:3000%'
        `)
        await poolConnection.query(`
          UPDATE \`players\` 
          SET \`picture_url\` = REPLACE(\`picture_url\`, 'https://localhost:3000', '')
          WHERE \`picture_url\` LIKE 'https://localhost:3000%'
        `)

        await poolConnection.query(`
          UPDATE \`games\` 
          SET \`modal_image\` = REPLACE(\`modal_image\`, 'http://127.0.0.1:3000', '')
          WHERE \`modal_image\` LIKE 'http://127.0.0.1:3000%'
        `)
        await poolConnection.query(`
          UPDATE \`games\` 
          SET \`bg_image\` = REPLACE(\`bg_image\`, 'http://127.0.0.1:3000', '')
          WHERE \`bg_image\` LIKE 'http://127.0.0.1:3000%'
        `)
        await poolConnection.query(`
          UPDATE \`players\` 
          SET \`picture_url\` = REPLACE(\`picture_url\`, 'http://127.0.0.1:3000', '')
          WHERE \`picture_url\` LIKE 'http://127.0.0.1:3000%'
        `)
      } catch (err) {
        console.warn("Failed to sanitize localhost in games/players tables during self-heal:", err)
      }

      console.log("Database tables verified/created successfully.")
    } catch (err) {
      ensureTablesPromise = null // Reset so next calls can retry
      console.error("Failed to ensure database tables exist:", err)
      throw err
    }
  })()

  return ensureTablesPromise
}
