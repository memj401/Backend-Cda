DELETE FROM "membros";
ALTER SEQUENCE membros_id_membro_seq RESTART; /*Reiniciando a squência dos id's para 1*/

INSERT INTO "membros"("nome", "cargo", "matricula","rfid", "senha")
VALUES 
('Marcos', 'Consultor de Operacoes', '000000001', '00001','$2b$10$wZPb8nBgzDyPDymiSmLMzOfruiS1WjAccaYjgChXgvm30lcPtUTVK'),
('Tambara', 'Consultor de Negocios', '000000002', '00002','$2b$10$35F9vysGR3amwharr6fgwuoZfNkz31fRGTw.Hd4GFF5s4VUujpRAe'),
('Enzo', 'Consultor de Marketing', '000000003', '00003','$2b$10$k9GgEkLHseyAPnwLm5f48u4sR7sxX5QtU1VhOo9ul08Ny9Y6TOlRi'),
('David', 'Gerente de Inovacao', '000000004', '00004','$2b$10$KUyyglevD.1cMCFY3H3tse0b3YwF3Ev/hI0x1rnjz.1/PlDLkGpjG'),
('Maria', 'Diretora de Negocios', '000000006', '00006','$2b$10$Fci6zs6XtO2wweYL9wtWAudf4XuFIwJQDa7L0XMuRz46Vk0AyEf2m'),
('Emanuel', 'Consultor de Operacoes', '000000007', '00007','$2b$10$TkVGhKMmSFjzHgkK2CXs8ub35kEplvKAnTRtz1oxSt1LJ7duBejJa'),
('Lucas', 'Consultor de Marketing', '000000008', '00008','$2b$10$q9FC.jBjyZlP3g1y2dxiEez7Ho6FoMkJqbiGpqkxlZcVcyq6kyM9S'),
('Sabrina', 'PresInt', '000000009', '00009','$2b$10$gQ/i9pAHFxZzoDIsnHoBF.a0sDjtgIgqVmUHde225F9rDUBBmCj6m'), 
('Alexandre', 'Diretor de Operacoes', '000000005', '00005','$2b$10$auVTQswjLKhVC/ZKNjduHeErswmSiuawZdNoa6Tog5ZUgOQ29Y4wm');