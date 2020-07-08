DROP TABLE IF EXISTS "horarios" CASCADE;

CREATE TABLE "horarios"(
  "dia" VARCHAR NOT NULL,
  "entrada" INTEGER NOT NULL,
  "saida" INTEGER NOT NULL, 
  "id_horario" SERIAL PRIMARY KEY
);