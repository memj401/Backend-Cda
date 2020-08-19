DELETE FROM "usuarios";

INSERT INTO "usuarios"("nome", "senha", "permissao")
VALUES 
  ('admin', '$2b$10$92qU5M90FlCUjFogEoGzh.0BplFWIl1XdnzfM8.x5lCOZvtQ6TTey', 1);
  
/**
 * A senha base é 'admin'
 */



 