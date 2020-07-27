paineldeControleRepositorio = require ('../repositorios/painelDeControle')

painelDeControleControladora = {
	listarTudo: async function (requisicao, resposta) {
		const relatorio  = await paineldeControleRepositorio.buscarTodos()
		if (relatorio.length  === 0) {
			return resposta.status(404).json({erro: 'Não há entradas no painel'})
		}
		return resposta.status(200).json(relatorio)
	}
}
module.exports = painelDeControleControladora