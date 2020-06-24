DELETE FROM "relacao_membros_conhecimentos";

INSERT INTO "relacao_membros_conhecimentos"("id_membro","id_conhecimento", "nivel")
VALUES
(1,1, (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
(1,2, (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
(2,3, (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
(3,3, (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
(3,2, (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
(3,7, (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
(5,6, (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
(5,8, (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)]));

/*Gera relações aleatórias entre o membro e o conhecimento*/