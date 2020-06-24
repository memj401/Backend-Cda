const conhecimentoRepositorio = require('../repositorios/conhecimento')

const conhecimentoControladora = {
	listarTodos: async function(requisicao, resposta) {
		const conhecimentos = await conhecimentoRepositorio.buscarTodos()
		if (conhecimentos.length === 0) {
			return resposta.status(404).json({erro: 'Não Há Conhecimentos no Banco de Dados'})
		}
		return resposta.status(200).json(conhecimentos)
	},

	buscar: async function (requisicao, resposta) {
		const idConhecimento = requisicao.params.id
		const conhecimento = await conhecimentoRepositorio.buscar(idConhecimento)
		
		if (!conhecimento) {
     	return resposta.status(404).json({erro :'Conhecimento não Encontrado' })
    	}

    	return resposta.status(200).json(conhecimento)
	},

	inserir: async function (requisicao, resposta) {
		const conhecimento = requisicao.body.conhecimento
		const descricao = requisicao.body.descricao
		if (!conhecimento) {
			return resposta.status(400).json({erro : 'Requisição Vazia'})
		}

		const conhecimentoJaExiste = await conhecimentoRepositorio.buscarPorNome(conhecimento)

		if (conhecimentoJaExiste) {
			return resposta.status(400).json({erro : 'Este Conhecimento Já Existe'})
		}

		await conhecimentoRepositorio.inserir(conhecimento, descricao)
		const conhecimentoInserido = await conhecimentoRepositorio.buscarPorNome(conhecimento)
		return resposta.status(201).json(conhecimentoInserido)
	},

	editar: async function (requisicao, resposta) {
		idConhecimento = requisicao.params.id
		const nome = requisicao.body.nome
		
		const conhecimentoExiste = await conhecimentoRepositorio.buscar(idConhecimento)
		
		if (!nome) {
			return resposta.status(400).json({erro: 'Requisição Vazia'})
		}

		if (!conhecimentoExiste) {
			return resposta.status(404).json({erro: 'Conhecimento não encontrado'})
		}

		const conhecimentoJaExiste = await conhecimentoRepositorio.buscarPorNome(nome)

		if (conhecimentoJaExiste) {
			return resposta.status(400).json({erro : 'Nome de Conhecimento Já Cadastrado'})
		}

		const conhecimentoAtualizado = await conhecimentoRepositorio.editar(nome,idConhecimento)
		return resposta.status(200).json(conhecimentoAtualizado)
	},

	remover: async function (requisicao, resposta) {
		const idConhecimento = requisicao.params.id
		const conhecimentoExiste = await conhecimentoRepositorio.buscar(idConhecimento)
		
		if (!conhecimentoExiste) {
			return resposta.status(404).json({erro: 'Conhecimento não encontrado'})
		}

		await conhecimentoRepositorio.remover(idConhecimento)
		return resposta.status(200).json({Resultado :'Conhecimento Deletado com Sucesso'})
	} 
}

module.exports = conhecimentoControladora