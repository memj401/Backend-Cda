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
    }
}
module.exports = painelDeControleControladora