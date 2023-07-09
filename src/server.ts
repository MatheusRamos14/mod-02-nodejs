import fastify from "fastify";
import { knex } from "./database";

const app = fastify();

app.get("/hello", async () => {
  const tables = knex.select("*").from("sqlite_schema");

  return tables;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server running at port 3333");
  });
