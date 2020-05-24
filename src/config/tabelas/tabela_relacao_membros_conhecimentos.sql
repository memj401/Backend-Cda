DROP TABLE IF EXISTS "relacao_membros_conhecimentos";

CREATE TABLE "relacao_membros_conhecimentos"(
  "id_membro" INTEGER REFERENCES membros (id) ON DELETE CASCADE,
  "id_conhecimento" INTEGER REFERENCES conhecimentos (id) ON DELETE CASCADE,
  "nivel" VARCHAR
);