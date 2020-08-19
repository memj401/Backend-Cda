painelDeControleRepositorio = require ('../repositorios/painelDeControle')

/**
    * Controladora do Painel de Controle
    * @namespace painelDeControleControladora
*/

painelDeControleControladora = {
	/**
        * Lista todos as entradas do Painel de Controle
        * @memberof painelDeControleControladora
        * @method listarTudo
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object} Retorna todas as entradas da tabela
    */
	listarTudo: async function (requisicao, resposta) {
		const relatorio  = await painelDeControleRepositorio.buscarTodos()
		if (relatorio.length  === 0) {
			return resposta.status(404).json({erro: 'Não há entradas no painel'})
		}
		return resposta.status(200).json(relatorio)
	},
	/**
        * Lista todos os pdf's anteriores das entradas do Painel de Controle
        * @memberof painelDeControleControladora
        * @method listarTudo
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object} Retorna a lista dos pdf's
    */	
	listarRelatoriosAntigos: async function (requisicao, resposta){
		const dados = await painelDeControleRepositorio.listarRelatorios()
		if(dados == false){
			return resposta.status(404).json({erro: "Não há relatórios antigos"})
		}
		return resposta.status(200).json(dados)
	},
	/**
        * Busca um pdf do Painel de Controle, específico
        * @memberof painelDeControleControladora
        * @method listarTudo
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object} Retorna o pdf desejado
    */
	buscarPdfControle: async function (requisicao, resposta){
		const arquivo = requisicao.params.arquivo
		return resposta.status(200).sendFile(path.resolve(`src/relatorios/Controle/${arquivo}`))
	},
	/**
        * Insere uma entrada no Painel de Controle após ocorrer alguma modificação por um usuário
        * @memberof painelDeControleControladora
        * @method inserir
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Boolean} Retorna verdadeiro apenas para ilustrar o fim da função
    */	
	inserir: async function  (requisicao,resposta) {
		const metodoHTTP = requisicao.method
		const url = requisicao.url
		const usuario = requisicao.usuario

		const localDaAlteracao = url.split('/')[1]

		if (metodoHTTP === 'PUT' || metodoHTTP === 'PATCH') {
			
			if (localDaAlteracao === 'usuarios' || localDaAlteracao === 'membros' || localDaAlteracao === 'conhecimentos') {
				alteracao = `Alteração de informações em ${localDaAlteracao} (${requisicao.nome})`
			} else {
				alteracao = `Alteração de informações em ${localDaAlteracao}`
			}
		}

		if (metodoHTTP === 'POST') {
			
			if (localDaAlteracao === 'usuarios' || localDaAlteracao === 'membros' || localDaAlteracao === 'conhecimentos') {
				alteracao = `Inserção de informações em ${localDaAlteracao} (${requisicao.nome})`
			} else {
				alteracao = `Inserção de informações em ${localDaAlteracao}`
			}
		}

		if (metodoHTTP === 'DELETE') {
			
			if (localDaAlteracao === 'usuarios' || localDaAlteracao === 'membros' || localDaAlteracao === 'conhecimentos') {
				alteracao = `Remoção de informações em ${localDaAlteracao} (${requisicao.nome})`
			} else {
				alteracao = `Remoção de informações em ${localDaAlteracao}`
			}
		}

		await painelDeControleRepositorio.inserir(usuario,alteracao)
		return true
	}
}
module.exports = painelDeControleControladora