DELETE FROM "membros";
ALTER SEQUENCE membros_id_seq RESTART; /*Reiniciando a squência dos id's para 1*/

INSERT INTO "membros"("nome", "cargo", "matricula","rfid")
VALUES 
  ('Teste1', 'Consultor de Operacoes', '000000001', '00001'),
  ('Teste2', 'Consultor de Negocios', '000000002', '00002'),
  ('Teste3', 'Consultor de Marketing', '000000003', '00003'),
  ('Teste4', 'Gerente de Inovacao', '000000004', '00004'),
  ('Teste5', 'Diretor de Operacoes', '000000005', '00005')
;