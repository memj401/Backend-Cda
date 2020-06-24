DROP TABLE IF EXISTS "conhecimentos" CASCADE;

CREATE TABLE "conhecimentos"(
  "nome" VARCHAR(35) NOT NULL UNIQUE,
  "id_conhecimento" SERIAL PRIMARY KEY,
  "descricao" VARCHAR
);