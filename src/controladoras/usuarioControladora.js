const usuarioRepositorio = require('../repositorios/usuario')
const bcrypt = require('bcrypt')

const usuarioControladora = {
	
	/**
	 * Lista Todos os membros que existem no Banco de Dados
	 *
	 * @param      {Object}  Representa a requisicao  a requisição feita pela aplicação
	 * @param      {Object}  Representa a resposta do servidor
	 * @return     {Object[]}  { Retorna a lista de todos os membros, em formato json }
	 */
	
	listarTodos: async function(requisicao, resposta) {
    	const usuarios = await usuarioRepositorio.buscarTodos()
    	if (!usuarios) {
       	return resposta.status(404).json({erro: 'Não Há Membros no Banco de Dados'})
    	} 
      	return resposta.status(200).json(usuarios)
  	},

	inserir: async function (requisicao, resposta) {
		const dados = requisicao.body
		const somenteDigitosPermissao = /^\d+$/.test(dados.permissao)
		
		if (!dados.nomeDeUsuario || !dados.senha || !dados.permissao) {
			return resposta.status(400).json({erro : 'Estão Faltando Campos'})
		}

		const usuarioJaExiste =  await usuarioRepositorio.buscar(dados.nomeDeUsuario)
		
		if (usuarioJaExiste) {
			return resposta.status(400).json({erro : 'Usuário Já Cadastrado'})
		}

		if (!somenteDigitosPermissao) {
			return resposta.status(400).json({erro : 'Permissão Inválida'})
		}

		if (dados.permissao < 1 || dados.permissao > 4 ) {
			return resposta.status(400).json({erro : 'Nível de Permissão Inválido'})
		}
		const sal = await bcrypt.genSalt()
		const hash = await bcrypt.hash(dados.senha, sal)
		dados.senha = hash
		await usuarioRepositorio.inserir(dados)
		usuarioCriado = await usuarioRepositorio.buscar(dados.nomeDeUsuario)
		delete usuarioCriado.senha
		return resposta.status(201).json(usuarioCriado)
	},

	remover: async function (requisicao, resposta) {
		const nomeDeUsuario = requisicao.params.usuario
		const usuarioExiste = await usuarioRepositorio.buscar(nomeDeUsuario)
 		
 		if (!usuarioExiste) {
			return resposta.status(400).json({erro : 'Usuário Não Encontrado'})
		}
		
		await usuarioRepositorio.remover(nomeDeUsuario)
		return resposta.status(200).json({resultado :'Membro Deletado com Sucesso'})
	},

	editar: async function (requisicao, resposta) {
		const nomeDeUsuario = requisicao.params.usuario
		const dados = requisicao.body
		const usuarioExiste = await usuarioRepositorio.buscar(nomeDeUsuario)
		const somenteDigitosPermissao = /^\d+$/.test(dados.permissao)
		
		if (!usuarioExiste) {
			return resposta.status(400).json({erro : 'Usuário Não Encontrado'})
		}

		if (Object.keys(dados).length === 0) {
			return resposta.status(400).json({erro: 'Requisição Vazia'})
		}
		
		if(dados.nomeDeUsuario){
			const usuarioJaExiste = await usuarioRepositorio.buscar(dados.nomeDeUsuario)
			
			if (usuarioJaExiste) {
				return resposta.status(400).json({erro: 'Nome de Usuário Já Cadastrado'})
			}
		}

		if (dados.permissao || dados.permissao === 0) {
			
			if (!somenteDigitosPermissao) {
				return resposta.status(400).json({erro : 'Permissão Inválida'})
			}

			if (dados.permissao  < 1 || dados.permissao > 4) {
			return resposta.status(400).json({erro : 'Nível de Permissão Inválido'})
			}
		}
		await usuarioRepositorio.editar(dados, nomeDeUsuario)
		
		if (dados.nomeDeUsuario) {
			resultado = await usuarioRepositorio.buscar(dados.nomeDeUsuario)
			delete resultado.senha
			return resposta.status(200).json(resultado)
		} 
		
		resultado = await usuarioRepositorio.buscar(nomeDeUsuario)
		delete resultado.senha
		return resposta.status(200).json(resultado)
	},

	mudarSenha: async function (requisicao, resposta) {
		const nomeDeUsuario = requisicao.params.usuario
		const senha = requisicao.body.senha
		const usuarioExiste = await usuarioRepositorio.buscar(nomeDeUsuario)
		
		if (!usuarioExiste) {
			return resposta.status(400).json({erro : 'Usuário Não Encontrado'})
		}

		const sal = await bcrypt.genSalt() 
		const hash = await bcrypt.hash(senha, sal)
		await usuarioRepositorio.mudarSenha(hash,nomeDeUsuario)
		return  resposta.status(200).json({resultado: 'Senha Alterada com Sucesso'})
	}
}

module.exports = usuarioControladora