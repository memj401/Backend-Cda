DROP TABLE IF EXISTS "relacao_membros_conhecimentos";

CREATE TABLE "relacao_membros_conhecimentos"(
  "id_membro" INTEGER REFERENCES membros (id_membro)  ON UPDATE CASCADE ON DELETE CASCADE,
  "id_conhecimento" INTEGER REFERENCES conhecimentos (id_conhecimento)  ON UPDATE CASCADE,
  "nivel" VARCHAR,
  PRIMARY KEY (id_membro, id_conhecimento)
);