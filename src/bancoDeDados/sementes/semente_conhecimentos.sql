DELETE FROM "conhecimentos";
ALTER SEQUENCE conhecimentos_id_conhecimento_seq RESTART; /*Reiniciando a squência dos id's para 1*/

INSERT INTO "conhecimentos"("nome","descricao")
VALUES
('Arduino','Habilidade de Programar e Realizar projetos em Arduino'), 
('Programacao', 'Conhecimento geral de paradigmas e lingugens de programação'),
('Soldagem', 'Habilidade de Realizar Soldas em peças e/ou circuitos elétricos'),
('Raspberry', 'Habilidade de Programar e Realizar projetos em Raspberry Pi'),
('Mecanica', 'Conhecimento sobre mecanismos e máquinas mecânicas'),
('Eletronica', 'Capacidade de Manusear e trabalhar com componentes eletrônicos. Ex: Transistor'),
('Modelagem 3D', 'Capacidade de Utilizar softwares de modelagem para construção de peças e componentes em 3D'),
('Sensoreamento', 'Capacidade de Trabalhar e integrar diversos tipos de sensores em um ou mais projetos');
