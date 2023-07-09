import "dotenv/config";
import fastify from "fastify";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

app.get("/hello", async () => {
  const tables = await knex("transactions").select("*");

  return tables;
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server running at port ${env.PORT}`);
  });
