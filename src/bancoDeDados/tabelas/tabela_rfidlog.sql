DROP TABLE IF EXISTS "rfidlog";

CREATE TABLE "rfidlog"(
  "nome" VARCHAR NOT NULL,	
  "rfid" VARCHAR NOT NULL,
  "valido" BOOLEAN NOT NULL,
  "data" DATE NOT NULL,
  "horario" TIME  NOT NULL
);