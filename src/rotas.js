const Roteador = require('express').Router

const middlewareAutenticacao = require('./middlewares/garantirUsuarioAutenticado')
const verificarTokenFront = require('./middlewares/verificarToken')

const membroControladora = require('./controladoras/membroControladora')
const usuarioControladora = require('./controladoras/usuarioControladora')
const sessaoControladora = require('./controladoras/sessaoControladora')
const conhecimentoControladora = require('./controladoras/conhecimentoControladora')
const conhecimentoDoMembroControladora = require('./controladoras/conhecimentoDoMembroControladora')
const eletronicaControladora = require('./controladoras/eletronicaControladora')
const horariosControladora = require('./controladoras/horariosControladora')
const painelDeControleControladora = require('./controladoras/painelDeControleControladora')


const roteador = new Roteador()

//Métodos Relacionados à Sessão
roteador.post('/', sessaoControladora.criar)

//Verificação do Token pro FrontEnd
roteador.get('/verificar', verificarTokenFront)

//Funcionalidades Relacionadas a passagem do RFID
roteador.post('/rfid/acesso', eletronicaControladora.receberAcesso)
roteador.post('/rfid/permanencia',eletronicaControladora.receberPermanencia)

//Middleware de Verficação do JWT
roteador.use(middlewareAutenticacao)

//Funcionalidades Relacionadas ao Usuário  
roteador.post('/usuarios', usuarioControladora.inserir, painelDeControleControladora.inserir)
roteador.put('/usuarios/:usuario', usuarioControladora.editar, painelDeControleControladora.inserir)
roteador.delete('/usuarios/:usuario', usuarioControladora.remover, painelDeControleControladora.inserir)
roteador.get('/usuarios', usuarioControladora.listarTodos)
roteador.put('/usuarios/senha/:usuario', usuarioControladora.mudarSenha, painelDeControleControladora.inserir)

//Funcionalidades Relacionadas aos Conhecimentos
roteador.get('/conhecimentos', conhecimentoControladora.listarTodos)
roteador.get('/conhecimentos/:id', conhecimentoControladora.buscar)
roteador.post('/conhecimentos', conhecimentoControladora.inserir, painelDeControleControladora.inserir)
roteador.put('/conhecimentos/:id', conhecimentoControladora.editar, painelDeControleControladora.inserir)
roteador.delete('/conhecimentos/:id', conhecimentoControladora.remover, painelDeControleControladora.inserir)

//Funcionalidades Relacionadas ao Membro
roteador.get('/membros', membroControladora.listarTodos)
roteador.get('/membros/listar/:parametro', membroControladora.listar)
roteador.get('/membros/:id', membroControladora.buscar)
roteador.post('/membros', membroControladora.inserir, painelDeControleControladora.inserir)
roteador.put('/membros/:id', membroControladora.editar, painelDeControleControladora.inserir)
roteador.delete('/membros/:id', membroControladora.remover, painelDeControleControladora.inserir)
roteador.patch('/membros/:id',membroControladora.mudarSenha, painelDeControleControladora.inserir)

//Funcionalidades Relacionadas aos Conhecimentos do Membro
roteador.post('/membros/:id_membro/conhecimentos/:id_conhecimento', conhecimentoDoMembroControladora.inserir, painelDeControleControladora.inserir)
roteador.patch('/membros/:id_membro/conhecimentos/:id_conhecimento', conhecimentoDoMembroControladora.editar, painelDeControleControladora.inserir)
roteador.delete('/membros/:id_membro/conhecimentos/:id_conhecimento', conhecimentoDoMembroControladora.remover, painelDeControleControladora.inserir)

//Funcionalidades da Parte de Acessos no RFID
roteador.get('/cadastro', eletronicaControladora.buscarParaCadastro)
roteador.get('/relatorios/acessos', eletronicaControladora.listarAcessos)
roteador.get('/relatorios/antigos/acessos', eletronicaControladora.listarAcessosAntigos)
roteador.get('/relatorios/antigos/acessos/:arquivo', eletronicaControladora.buscarPdfAcesso)

//Funcionalidades da Parte de Horário de Permanência no RFID
roteador.get('/relatorios/permanencia', eletronicaControladora.listarPermanencias)
roteador.get('/relatorios/antigos/permanencia', eletronicaControladora.listarPermanenciasAntigas)
roteador.get('/relatorios/antigos/permanencia/:arquivo', eletronicaControladora.buscarPdfPermanencia)

//Funcionalidades relacionadas aos horários de permanência
roteador.get('/horarios', horariosControladora.listarTodos)
roteador.post('/horarios', horariosControladora.inserir, painelDeControleControladora.inserir)
roteador.delete('/horarios', horariosControladora.remover, painelDeControleControladora.inserir)

//Funcionalidades relacionadas ao Painel de Controle
roteador.get('/relatorios/controle', painelDeControleControladora.listarTudo)
roteador.get('/relatorios/antigos/controle', painelDeControleControladora.listarRelatoriosAntigos)
roteador.get('/relatorios/antigos/controle/:arquivo', painelDeControleControladora.buscarPdfControle)

module.exports = roteador