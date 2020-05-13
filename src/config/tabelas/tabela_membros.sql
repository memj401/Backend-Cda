DROP TABLE IF EXISTS "membros";

CREATE TABLE "membros"(
  "nome" VARCHAR(50) NOT NULL,
  "cargo" VARCHAR (50) NOT NULL,
  "matricula" VARCHAR (9) UNIQUE NOT NULL,
  "rfid" VARCHAR (5) UNIQUE NOT NULL,
  "id" SERIAL PRIMARY KEY
);