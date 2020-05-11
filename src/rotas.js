const Roteador = require('express').Router

const middlewareAutenticacao = require('./middlewares/garantirUsuarioAutenticado')

const membroControladora = require('./controladoras/membroControladora')
const usuarioControladora = require('./controladoras/usuarioControladora')
const sessaoControladora = require('./controladoras/sessaoControladora')
const pyControladora = require('./Controladoras/pyControladora')

const roteador = new Roteador()

//Métodos Relacionados à Sessão
roteador.post('/', sessaoControladora.criar)

//Middleware de Verficação do JWT
roteador.use(middlewareAutenticacao)

//Funcionalidades Relacionadas ao Usuário  
roteador.post('/usuarios', usuarioControladora.inserir)
roteador.put('/usuarios/:usuario', usuarioControladora.editar)
roteador.delete('/usuarios/:usuario', usuarioControladora.remover)
roteador.get('/usuarios', usuarioControladora.listarTodos)
roteador.put('/usuarios/senha/:usuario', usuarioControladora.mudarSenha)

//Funcionalidades Relacionadas ao Membro
roteador.get('/membros', membroControladora.listarTodos)
roteador.get('/membros/listar/:parametro', membroControladora.listar)
roteador.get('/membros/:id', membroControladora.buscar)
roteador.post('/membros', membroControladora.inserir)
roteador.put('/membros/:id', membroControladora.editar)
roteador.delete('/membros/:id', membroControladora.remover)

//Funcionalidades da parte eletrônica 
roteador.get('/py/rfid/cadastro', pyControladora.mandarProFront)
roteador.post('/py/rfid', pyControladora.receberRFid)
roteador.get('/py/rfid/log', pyControladora.pegarTodoRegistro)

module.exports = roteador