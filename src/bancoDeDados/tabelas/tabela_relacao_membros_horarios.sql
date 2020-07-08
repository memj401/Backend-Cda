DROP TABLE IF EXISTS "relacao_membros_horarios" CASCADE;

CREATE TABLE "relacao_membros_horarios"(
  "id_membro" INTEGER REFERENCES membros (id_membro) ON UPDATE CASCADE ON DELETE CASCADE,
  "id_horario" INTEGER REFERENCES horarios (id_horario) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY(id_membro)
);