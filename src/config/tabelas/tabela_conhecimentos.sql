DROP TABLE IF EXISTS "conhecimentos" CASCADE;

CREATE TABLE "conhecimentos"(
  "conhecimento" VARCHAR(35) NOT NULL,
  "id_conhecimento" SERIAL PRIMARY KEY
);