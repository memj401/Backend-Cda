DROP TABLE IF EXISTS "conhecimentos";

CREATE TABLE "conhecimentos"(
  "conhecimento" VARCHAR(35) NOT NULL,
  "nivel" VARCHAR(15) NOT NULL,
  "membro_id" INTEGER REFERENCES membros (id) ON DELETE CASCADE
);