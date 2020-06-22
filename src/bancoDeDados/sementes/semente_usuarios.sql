DELETE FROM "usuarios";

INSERT INTO "usuarios"("nome", "senha", "permissao")
VALUES 
  ('User_1', '$2b$10$kSGlgyU70rCyOz5yQC4wiujuz2FZ8mbiN3/WBBfJ6Li4IFWw44992', 1),
  ('User_2', '$2b$10$o73nLMsXE0e/arrmLb2vBOww06kYX6Wtx9YnxJocmsLcip.10txnm', 2),
  ('User_3', '$2b$10$bimMZHSMKGk20zaYV2.Up.9nSkQS36xx2M2D4coOwXtSMX/HrtQtC', 3),
  ('User_4', '$2b$10$uPfwgyu2O3OM6yNEaM5pnuhCOvngpPBjX.Yt72m3hNtKUydECdT9y', 4);
  
/**
 * A senha de todos os usuarios é 'teste'
 */