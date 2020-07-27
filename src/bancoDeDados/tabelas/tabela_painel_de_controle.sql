DROP TABLE IF EXISTS "painel_de_controle";

CREATE TABLE "painel_de_controle"(
  "data" DATE NOT NULL,
  "hora" TIME NOT NULL,
  "usuario" VARCHAR NOT NULL,
  "alteracao" VARCHAR
);
