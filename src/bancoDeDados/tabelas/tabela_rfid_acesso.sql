DROP TABLE IF EXISTS "rfid_acesso";

CREATE TABLE "rfid_acesso"(
  "nome" VARCHAR NOT NULL,	
  "rfid" VARCHAR NOT NULL,
  "valido" BOOLEAN NOT NULL,
  "data" DATE NOT NULL,
  "horario" TIME  NOT NULL
);