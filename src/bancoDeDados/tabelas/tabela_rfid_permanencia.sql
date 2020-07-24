DROP TABLE IF EXISTS "rfid_permanencia" CASCADE;

CREATE TABLE "rfid_permanencia"(
  "nome" VARCHAR,
  "data" DATE NOT NULL,
  "entrada" TIME NOT NULL,
  "saida" TIME,
  "valido_entrada" BOOLEAN,
  "valido_saida" BOOLEAN
);