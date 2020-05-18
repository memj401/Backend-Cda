DROP TABLE IF EXISTS "rfidlog";

CREATE TABLE "rfidlog"(
  "rfid" VARCHAR NOT NULL,
  "valido" BOOLEAN NOT NULL,
  "horario" TIMESTAMP  NOT NULL
);