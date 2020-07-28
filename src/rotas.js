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
const gerarEntradaPainelDeControle = require('./middlewares/gerarEntradaPainelDeControle')


const roteador = new Roteador()

//Métodos Relacionados à Sessão
roteador.post('/', sessaoControladora.criar)

//Verificação do Token pro FrontEnd
roteador.get('/verificar', verificarTokenFront)

//Middleware de Verficação do JWT
roteador.use(middlewareAutenticacao)

//Funcionalidades Relacionadas ao Usuário  
roteador.post('/usuarios', usuarioControladora.inserir, gerarEntradaPainelDeControle)
roteador.put('/usuarios/:usuario', usuarioControladora.editar, gerarEntradaPainelDeControle)
roteador.delete('/usuarios/:usuario', usuarioControladora.remover, gerarEntradaPainelDeControle)
roteador.get('/usuarios', usuarioControladora.listarTodos)
roteador.put('/usuarios/senha/:usuario', usuarioControladora.mudarSenha, gerarEntradaPainelDeControle)

//Funcionalidades Relacionadas aos Conhecimentos
roteador.get('/conhecimentos', conhecimentoControladora.listarTodos)
roteador.get('/conhecimentos/:id', conhecimentoControladora.buscar)
roteador.post('/conhecimentos', conhecimentoControladora.inserir, gerarEntradaPainelDeControle)
roteador.put('/conhecimentos/:id', conhecimentoControladora.editar, gerarEntradaPainelDeControle)
roteador.delete('/conhecimentos/:id', conhecimentoControladora.remover, gerarEntradaPainelDeControle)

//Funcionalidades Relacionadas ao Membro
roteador.get('/membros', membroControladora.listarTodos)
roteador.get('/membros/listar/:parametro', membroControladora.listar)
roteador.get('/membros/:id', membroControladora.buscar)
roteador.post('/membros', membroControladora.inserir, gerarEntradaPainelDeControle)
roteador.put('/membros/:id', membroControladora.editar, gerarEntradaPainelDeControle)
roteador.delete('/membros/:id', membroControladora.remover, gerarEntradaPainelDeControle)

//Funcionalidades Relacionadas aos Conhecimentos do Membro
roteador.post('/membros/:id_membro/conhecimentos/:id_conhecimento', conhecimentoDoMembroControladora.inserir, gerarEntradaPainelDeControle)
roteador.patch('/membros/:id_membro/conhecimentos/:id_conhecimento', conhecimentoDoMembroControladora.editar, gerarEntradaPainelDeControle)
roteador.delete('/membros/:id_membro/conhecimentos/:id_conhecimento', conhecimentoDoMembroControladora.remover, gerarEntradaPainelDeControle)

//Funcionalidades da parte eletrônica 
roteador.get('/cadastro', eletronicaControladora.buscarParaCadastro)
roteador.post('/rfid/acesso', eletronicaControladora.receberAcesso)
roteador.get('/relatorios/acessos', eletronicaControladora.listarAcessos)
roteador.get('/relatorios/antigos/acessos', eletronicaControladora.listarAcessosAntigos)
roteador.post('/rfid/permanencia',eletronicaControladora.receberPermanencia)
roteador.get('/relatorios/permanencia', eletronicaControladora.listarPermanencias)

//Funcionalidades relacionadas aos horários de permanência
roteador.get('/horarios', horariosControladora.listarTodos)
roteador.post('/horarios', horariosControladora.inserir, gerarEntradaPainelDeControle)
//roteador.put('/horarios/:id_membro', horariosControladora.editar)
roteador.delete('/horarios', horariosControladora.remover, gerarEntradaPainelDeControle)

//Funcionalidades relacionadas ao Painel de Controle
roteador.get('/painel', painelDeControleControladora.listarTudo)

module.exports = roteador