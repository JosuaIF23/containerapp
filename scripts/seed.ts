import "dotenv/config";
import argon2 from "argon2";
import { randomUUID } from "crypto";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { users } from "../lib/db/schema";

const ADMIN_EMAIL = "admin@ptgis.local";
const ADMIN_PASSWORD = "Admin123!Change";

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection, { mode: "default" });

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL));

  if (existing.length > 0) {
    console.log(`User ${ADMIN_EMAIL} already exists, skipping.`);
    await connection.end();
    return;
  }

  const passwordHash = await argon2.hash(ADMIN_PASSWORD);
  const now = new Date();

  await db.insert(users).values({
    id: randomUUID(),
    fullName: "Administrator",
    email: ADMIN_EMAIL,
    passwordHash,
    role: "super_admin",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Seed admin user created:");
    console.log(`  email:    ${ADMIN_EMAIL}`);
    console.log(`  password: ${ADMIN_PASSWORD}`);
  } else {
    console.log("Seed admin user created.");
  }

  await connection.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
