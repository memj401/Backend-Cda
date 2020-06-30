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


const roteador = new Roteador()

//Métodos Relacionados à Sessão
roteador.post('/', sessaoControladora.criar)

//Verificação do Token pro FrontEnd
roteador.get('/verificar', verificarTokenFront)

//Middleware de Verficação do JWT
roteador.use(middlewareAutenticacao)

//Funcionalidades Relacionadas ao Usuário  
roteador.post('/usuarios', usuarioControladora.inserir)
roteador.put('/usuarios/:usuario', usuarioControladora.editar)
roteador.delete('/usuarios/:usuario', usuarioControladora.remover)
roteador.get('/usuarios', usuarioControladora.listarTodos)
roteador.put('/usuarios/senha/:usuario', usuarioControladora.mudarSenha)

//Funcionalidades Relacionadas aos Conhecimentos
roteador.get('/conhecimentos', conhecimentoControladora.listarTodos)
roteador.get('/conhecimentos/:id', conhecimentoControladora.buscar)
roteador.post('/conhecimentos', conhecimentoControladora.inserir)
roteador.put('/conhecimentos/:id', conhecimentoControladora.editar)
roteador.delete('/conhecimentos/:id', conhecimentoControladora.remover)

//Funcionalidades Relacionadas ao Membro
roteador.get('/membros', membroControladora.listarTodos)
roteador.get('/membros/listar/:parametro', membroControladora.listar)
roteador.get('/membros/:id', membroControladora.buscar)
roteador.post('/membros', membroControladora.inserir)
roteador.put('/membros/:id', membroControladora.editar)
roteador.delete('/membros/:id', membroControladora.remover)

//Funcionalidades Relacionadas aos Conhecimentos do Membro
roteador.post('/membros/:id_membro/conhecimentos/:id_conhecimento', conhecimentoDoMembroControladora.inserir)
roteador.patch('/membros/:id_membro/conhecimentos/:id_conhecimento', conhecimentoDoMembroControladora.editar)
roteador.delete('/membros/:id_membro/conhecimentos/:id_conhecimento', conhecimentoDoMembroControladora.remover)

//Funcionalidades da parte eletrônica 
roteador.get('/cadastro', eletronicaControladora.buscarParaCadastro)
roteador.post('/rfid/acesso', eletronicaControladora.receberAcesso)
roteador.get('/relatorios/acessos', eletronicaControladora.listarAcessos)
roteador.post('/rfid/permanencia',eletronicaControladora.receberPermanencia)
roteador.get('/relatorios/permanencia', eletronicaControladora.listarPermanencias)

//Funcionalidades relacionadas aos horários de permanência
roteador.get('/horarios', horariosControladora.listarTodos)
roteador.get('/horarios/listar/:parametro', horariosControladora.listar)
roteador.post('/horarios', horariosControladora.inserir)
roteador.put('/horarios/:id', horariosControladora.editar)
roteador.delete('/horarios/:id', horariosControladora.remover)

module.exports = roteador