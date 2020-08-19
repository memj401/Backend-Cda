const conhecimentoRepositorio = require('../repositorios/conhecimento')
const membroRepositorio = require('../repositorios/membro')
const conhecimentoDoMembroRepositorio = require('../repositorios/conhecimentoDoMembro')

/**
    * Controladora de funções relacionadas a parte de Conhecimentos do Membro
    * @namespace conhecimentoDoMembroControladora
*/

conhecimentoDoMembroControladora = {
	/**
        * Insere conhecimento de um membro
        * @memberof conhecimentoDoMembroControladora
        * @method inserir
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
	   	* @param {Function} proximo - Referência para a próxima função da pilha (Gerar entrada no Painel De Controle)
        * @returns {Object} Retorna as informações inseridas
    */
	inserir: async function (requisicao, resposta, proximo) {
		const idMembro = requisicao.params.id_membro
		const idConhecimento = requisicao.params.id_conhecimento
		const nivel = requisicao.body.nivel
		const permissaoDoUsuario = requisicao.permissao
    	const usuarioLogado = requisicao.usuario

	    if (permissaoDoUsuario === 5) {
	      const membro = await membroRepositorio.buscarUmPor('nome', usuarioLogado)
	      if (membro.id_membro != idMembro) {
	        return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
	      }
	    } else if (permissaoDoUsuario > 4) {
	      return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
	    }    	

		const membroExiste = await membroRepositorio.buscarUm(idMembro)

		if (!membroExiste) {
			return resposta.status(404).json({erro: 'Membro Não Encontrado'})
		}

		const conhecimentoExiste = await conhecimentoRepositorio.buscar(idConhecimento)

		if (!conhecimentoExiste) {
			return resposta.status(404).json({erro: 'Conhecimento Não Encontrado'})
		}

		if (nivel !== 'iniciante' && nivel !== 'intermediario' && nivel !== 'avancado'){
			return resposta.status(400).json({erro: 'Nivel de Conhecimento Inválido'})
		}

		const conhecimentoDoMembroJaExiste = await conhecimentoDoMembroRepositorio.buscar(idMembro, idConhecimento)

		if (conhecimentoDoMembroJaExiste) {
			return resposta.status(400).json({erro: 'Este Membro Já Possui Este Conhecimento'})
		}
		
		await conhecimentoDoMembroRepositorio.inserir(idMembro, idConhecimento, nivel)
		
		let info = {
			conhecimento: conhecimentoExiste.nome,
			nivel: nivel,
			membro: membroExiste.nome
		}
		requisicao.nome = membroExiste.nome
		proximo()
		return resposta.status(201).json(info)
	},
	/**
        * Remove conhecimento de um membro
        * @memberof conhecimentoDoMembroControladora
        * @method remover
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
	   	* @param {Function} proximo - Referência para a próxima função da pilha (Gerar entrada no Painel De Controle)
        * @returns {Object} Retorna uma mensagem indicando que a deleção foi bem sucedida
    */
	remover: async function (requisicao, resposta, proximo) {
		const idMembro = requisicao.params.id_membro
		const idConhecimento = requisicao.params.id_conhecimento
	    const permissaoDoUsuario = requisicao.permissao
	    const usuarioLogado = requisicao.usuario
	    
	    if (permissaoDoUsuario === 5) {
	      const membro = await membroRepositorio.buscarUmPor('nome', usuarioLogado)
	      if (membro.id_membro != idMembro) {
	        return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
	      }
	    } else if (permissaoDoUsuario > 4) {
	      return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
	    }		

		const conhecimentoDoMembroExiste = await conhecimentoDoMembroRepositorio.buscar(idMembro, idConhecimento)

		if (!conhecimentoDoMembroExiste) {
			return resposta.status(404).json({erro: 'Este Membro Não Tem Este Conhecimento'})
		}

		await conhecimentoDoMembroRepositorio.remover(idMembro, idConhecimento)
		membro = await membroRepositorio.buscarUm(idMembro)
		requisicao.nome = membro.nome 
		proximo()
		return resposta.status(200).json({Resultado :'Conhecimento do Membro Deletado com Sucesso'}) 
	},
	/**
        * Edita conhecimento de um membro
        * @memberof conhecimentoDoMembroControladora
        * @method editar
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
	   	* @param {Function} proximo - Referência para a próxima função da pilha (Gerar entrada no Painel De Controle)
        * @returns {Object} Retorna as informações editadas
    */
	editar: async function (requisicao, resposta, proximo) {
		const idMembro = requisicao.params.id_membro
		const idConhecimento = requisicao.params.id_conhecimento
		const nivel = requisicao.body.nivel
		const permissaoDoUsuario = requisicao.permissao
    	const usuarioLogado = requisicao.usuario

	    if (permissaoDoUsuario === 5) {
	      const membro = await membroRepositorio.buscarUmPor('nome', usuarioLogado)
	      if (membro.id_membro != idMembro) {
	        return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
	      }
	    } else if (permissaoDoUsuario > 4) {
	      return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
	    }
	    
		const conhecimentoDoMembroExiste = await conhecimentoDoMembroRepositorio.buscar(idMembro, idConhecimento)

		if (!conhecimentoDoMembroExiste) {
			return resposta.status(404).json({erro: 'Este Membro Não Tem Este Conhecimento'})
		}
		
		if (nivel !== 'iniciante' && nivel !== 'intermediario' && nivel !== 'avancado'){
			return resposta.status(400).json({erro: 'Nivel de Conhecimento Inválido'})
		}		

		const novoNivel = await conhecimentoDoMembroRepositorio.editar(idMembro, idConhecimento, nivel)
		
		conhecimento = await conhecimentoRepositorio.buscar(idConhecimento)
		membro = await membroRepositorio.buscarUm(idMembro)
		
		let info = {
			conhecimento: conhecimento.nome,
			nivel: novoNivel,
			membro: membro.nome
		}
		requisicao.nome = membro.nome 
		proximo()
		return resposta.status(200).json(info)
	}
}

module.exports = conhecimentoDoMembroControladora