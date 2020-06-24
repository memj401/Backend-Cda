DELETE FROM "horarios";

INSERT INTO "horarios"("dia_da_semana", "entrada", "saida", "id_membro")
VALUES
((SELECT (array['segunda', 'terça', 'quarta', 'quinta', 'sexta'])[floor(random() * 5 + 1)]), 08, 10, 1),
((SELECT (array['segunda', 'terça', 'quarta', 'quinta', 'sexta'])[floor(random() * 5 + 1)]), 10, 12, 2),
((SELECT (array['segunda', 'terça', 'quarta', 'quinta', 'sexta'])[floor(random() * 5 + 1)]), 14, 16, 3),
((SELECT (array['segunda', 'terça', 'quarta', 'quinta', 'sexta'])[floor(random() * 5 + 1)]), 16, 18, 4);

/*Gera horários de exemplo para 4 membros registrados*/
