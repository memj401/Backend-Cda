DELETE FROM "relacao_membros_conhecimentos";

INSERT INTO "relacao_membros_conhecimentos"("id_membro","id_conhecimento", "nivel")
VALUES
((SELECT floor(random() * 5 + 1)::int),(SELECT floor(random() * 8 + 1)::int), (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
((SELECT floor(random() * 5 + 1)::int),(SELECT floor(random() * 8 + 1)::int), (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
((SELECT floor(random() * 5 + 1)::int),(SELECT floor(random() * 8 + 1)::int), (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
((SELECT floor(random() * 5 + 1)::int),(SELECT floor(random() * 8 + 1)::int), (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
((SELECT floor(random() * 5 + 1)::int),(SELECT floor(random() * 8 + 1)::int), (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
((SELECT floor(random() * 5 + 1)::int),(SELECT floor(random() * 8 + 1)::int), (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
((SELECT floor(random() * 5 + 1)::int),(SELECT floor(random() * 8 + 1)::int), (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)])),
((SELECT floor(random() * 5 + 1)::int),(SELECT floor(random() * 8 + 1)::int), (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)]));

/*Gera relações aleatórias entre o membro e o conhecimento*/