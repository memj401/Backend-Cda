DELETE FROM "membros";
ALTER SEQUENCE membros_id_membro_seq RESTART; /*Reiniciando a squência dos id's para 1*/

INSERT INTO "membros"("nome", "cargo", "matricula","rfid")
VALUES 
('Marcos', 'Consultor de Operacoes', '000000001', '00001'),
('Tambara', 'Consultor de Negocios', '000000002', '00002'),
('Enzo', 'Consultor de Marketing', '000000003', '00003'),
('David', 'Gerente de Inovacao', '000000004', '00004'),
('Maria', 'Diretora de Negocios', '000000006', '00006'),
('Emanuel', 'Consultor de Operacoes', '000000007', '00007'),
('Lucas', 'Consultor de Marketing', '000000008', '00008'),
('Sabrina', 'PresInt', '000000009', '00009'), 
('Alexandre', 'Diretor de Operacoes', '000000005', '00005');