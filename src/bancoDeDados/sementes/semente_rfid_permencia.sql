DELETE FROM "rfid_permanencia";


INSERT INTO "rfid_permanencia"("nome", "data", "entrada", "saida", "valido_entrada", "valido_saida")
VALUES 
  ('Marcos', CURRENT_DATE, CURRENT_TIME - interval '2 hours', CURRENT_TIME, 't','f'),
  ('Tambara', CURRENT_DATE, CURRENT_TIME - interval '2 hours', CURRENT_TIME, 'f','t'),
  ('Enzo', CURRENT_DATE - integer '1', CURRENT_TIME - interval '2 hours', CURRENT_TIME, 't','t'),
  ('David', CURRENT_DATE - integer '1', CURRENT_TIME - interval '2 hours', CURRENT_TIME, 'f','f')
;