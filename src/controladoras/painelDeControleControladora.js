painelDeControleRepositorio = require ('../repositorios/painelDeControle')

painelDeControleControladora = {
	listarTudo: async function (requisicao, resposta) {
		const relatorio  = await painelDeControleRepositorio.buscarTodos()
		if (relatorio.length  === 0) {
			return resposta.status(404).json({erro: 'Não há entradas no painel'})
		}
		return resposta.status(200).json(relatorio)
	},
	listarRelatoriosAntigos: async function (requisicao, resposta){
		const dados = await painelDeControleRepositorio.listarRelatorios()
		if(dados == false){
			return resposta.status(404).json({erro: "Não há relatórios antigos"})
		}
		return resposta.status(200).json(dados)
	},
	buscarPdfControle: async function (requisicao, resposta){
		const arquivo = requisicao.params.arquivo
		return resposta.status(200).sendFile(path.resolve(`src/relatorios/Controle/${arquivo}`))
	},
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