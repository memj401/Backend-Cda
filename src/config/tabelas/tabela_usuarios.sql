DROP TABLE IF EXISTS "usuarios";

CREATE TABLE "usuarios"(
  "nomeDeUsuario" VARCHAR(50) UNIQUE NOT NULL,
  "senha" VARCHAR NOT NULL,
  "permissao" INTEGER  NOT NULL
);