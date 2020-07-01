DELETE FROM "rfid_permanencia";


INSERT INTO "rfid_permanencia"("nome", "data", "entrada", "saida", "valido")
VALUES 
  ('Marcos', CURRENT_DATE, CURRENT_TIME - interval '2 hours', CURRENT_TIME, 't'),
  ('Tambara', CURRENT_DATE, CURRENT_TIME - interval '2 hours', CURRENT_TIME, 'f'),
  ('Enzo', CURRENT_DATE - integer '1', CURRENT_TIME - interval '2 hours', CURRENT_TIME, 't'),
  ('David', CURRENT_DATE - integer '1', CURRENT_TIME - interval '2 hours', CURRENT_TIME, 'f')
;