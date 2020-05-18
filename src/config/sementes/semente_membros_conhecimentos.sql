DELETE FROM "conhecimentos";

INSERT INTO "conhecimentos"("conhecimento", "nivel", "membro_id")
VALUES
('Arduino', (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)]), (SELECT floor(random() * 5 + 1)::int)), 
('Programacao', (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)]), (SELECT floor(random() * 5 + 1)::int)),
('Soldagem', (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)]), (SELECT floor(random() * 5 + 1)::int)),
('Raspberry', (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)]), (SELECT floor(random() * 5 + 1)::int)),
('Mecanica', (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)]), (SELECT floor(random() * 5 + 1)::int)),
('Eletronica', (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)]), (SELECT floor(random() * 5 + 1)::int)),
('Modelagem 3D', (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)]), (SELECT floor(random() * 5 + 1)::int)),
('Sensoreamento', (SELECT (array['iniciante', 'intermediario', 'avancado'])[floor(random() * 3 + 1)]), (SELECT floor(random() * 5 + 1)::int));

/*O	Script gera um nível de conhecimento e id, entre 1 e 5, associado aleatórios*/