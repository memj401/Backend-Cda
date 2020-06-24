DROP TABLE IF EXISTS "rfid_permanencia" CASCADE;

CREATE TABLE "rfid_permanencia"(
  "nome" VARCHAR REFERENCES membros (nome) ON UPDATE CASCADE ON DELETE CASCADE,
  "data" DATE NOT NULL,
  "entrada" INTEGER NOT NULL,
  "saida" INTEGER NOT NULL 
);