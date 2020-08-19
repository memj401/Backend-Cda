const conhecimentoRepositorio = require('../repositorios/conhecimento')

/**
    * Controladora de funções relacionadas a parte de Conhecimentos
    * @namespace conhecimentoControladora
*/

const conhecimentoControladora = {
	 /**
        * Lista todos os conhecimentos registrados no Banco de Dados
        * @memberof conhecimentoControladora
        * @method listarTodos
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object} Retorna um array com as informações de cada conhecimento registrado 
    */
	listarTodos: async function(requisicao, resposta) {
		const conhecimentos = await conhecimentoRepositorio.buscarTodos()
		if (conhecimentos.length === 0) {
			return resposta.status(404).json({erro: 'Não Há Conhecimentos no Banco de Dados'})
		}
		return resposta.status(200).json(conhecimentos)
	},
	 /**
        * Busca as informações de um determinado  conhecimento registrado no Banco de Dados
        * @memberof conhecimentoControladora
        * @method buscar
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object} Retorna um array com as informações do conhecimento, além dos membros que tem o conhecimento
    */
	buscar: async function (requisicao, resposta) {		
		const idConhecimento = requisicao.params.id
		const conhecimento = await conhecimentoRepositorio.buscar(idConhecimento)
		
		if (!conhecimento) {
     	return resposta.status(404).json({erro :'Conhecimento não Encontrado' })
    	}

    	return resposta.status(200).json(conhecimento)
	},
	 /**
        * Insere um conhecimento no banco de dados
        * @memberof conhecimentoControladora
        * @method inserir
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
	   	* @param {Function} proximo - Referência para a próxima função da pilha (Gerar entrada no Painel De Controle)
        * @returns {Object} Retorna as informações inseridas
    */
	inserir: async function (requisicao, resposta, proximo) {
		const conhecimento = requisicao.body.conhecimento
		const descricao = requisicao.body.descricao
	    const permissaoDoUsuario = requisicao.permissao
	    
	    if (permissaoDoUsuario > 4) {
	      return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
	    }

		if (!conhecimento) {
			return resposta.status(400).json({erro : 'Requisição Vazia'})
		}

		const conhecimentoJaExiste = await conhecimentoRepositorio.buscarPorNome(conhecimento)

		if (conhecimentoJaExiste) {
			return resposta.status(400).json({erro : 'Este Conhecimento Já Existe'})
		}

		await conhecimentoRepositorio.inserir(conhecimento, descricao)
		const conhecimentoInserido = await conhecimentoRepositorio.buscarPorNome(conhecimento)
		requisicao.nome = conhecimentoInserido.nome
		proximo()
		return resposta.status(201).json(conhecimentoInserido)
	},
	 /**
        * Edita um conhecimento no banco de dados
        * @memberof conhecimentoControladora
        * @method editar
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
	   	* @param {Function} proximo - Referência para a próxima função da pilha (Gerar entrada no Painel De Controle)        
	   	* @returns {Object} Retorna as informações atualizadas
    */
	editar: async function (requisicao, resposta, proximo) {
		idConhecimento = requisicao.params.id
		const dados = requisicao.body
	    const permissaoDoUsuario = requisicao.permissao
	    
	    if (permissaoDoUsuario > 4) {
	      return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
	    }

		const conhecimentoExiste = await conhecimentoRepositorio.buscar(idConhecimento)
		
		if (!dados.nome && !dados.descricao) {
			return resposta.status(400).json({erro: 'Requisição Vazia'})
		}

		if (!conhecimentoExiste) {
			return resposta.status(404).json({erro: 'Conhecimento não encontrado'})
		}

		const conhecimentoJaExiste = await conhecimentoRepositorio.buscarPorNome(dados.nome)

		if (conhecimentoJaExiste) {
			return resposta.status(400).json({erro : 'Nome de Conhecimento Já Cadastrado'})
		}

		const conhecimentoAtualizado = await conhecimentoRepositorio.editar(dados,idConhecimento)
		requisicao.nome = conhecimentoExiste.nome
		proximo()
		return resposta.status(200).json(conhecimentoAtualizado)
	},
	 /**
        * Remove um conhecimento no banco de dados
        * @memberof conhecimentoControladora
        * @method remover
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
	   	* @param {Function} proximo - Referência para a próxima função da pilha (Gerar entrada no Painel De Controle)
        * @returns {Object} Retorna uma mensagem indicando que a deleção foi bem sucedida
    */
	remover: async function (requisicao, resposta, proximo) {
		const idConhecimento = requisicao.params.id
		const conhecimentoExiste = await conhecimentoRepositorio.buscar(idConhecimento)
	    const permissaoDoUsuario = requisicao.permissao
	    
	    if (permissaoDoUsuario > 4) {
	      return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
	    }		
		
		if (!conhecimentoExiste) {
			return resposta.status(404).json({erro: 'Conhecimento não encontrado'})
		}

		await conhecimentoRepositorio.remover(idConhecimento)
		requisicao.nome = conhecimentoExiste.nome
		proximo()
		return resposta.status(200).json({Resultado :'Conhecimento Deletado com Sucesso'})
	} 
}

module.exports = conhecimentoControladora