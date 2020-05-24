DELETE FROM "conhecimentos";
ALTER SEQUENCE conhecimentos_id_seq RESTART; /*Reiniciando a squência dos id's para 1*/

INSERT INTO "conhecimentos"("conhecimento")
VALUES
('Arduino'), 
('Programacao'),
('Soldagem'),
('Raspberry'),
('Mecanica'),
('Eletronica'),
('Modelagem 3D'),
('Sensoreamento');
