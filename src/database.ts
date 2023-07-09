import { knex as knexSetup, Knex } from "knex";

if (!process.env.DATABASE_URL) {
  throw new Error("No database URL found on environment");
}

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: process.env.DATABASE_URL,
  },
  migrations: {
    directory: "./db/migrations",
    extension: "ts",
  },
  useNullAsDefault: true,
};

export const knex = knexSetup(config);
