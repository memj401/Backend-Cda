const chave = require('../config/autenticacao/chaveSecreta').chaveSecreta
const njwt = require('njwt')

async function verificarTokenFront (requisicao, resposta) {
	const cabecalho =  requisicao.headers.authorization
	const token = cabecalho.split(' ')[1]
	
	if (!token) {
		return resposta.status(401).json({erro: 'Token não Encontrado'})
	}
		try {
		const tokenVerificado = njwt.verify(token, chave)
		let resultado = {permissao : tokenVerificado.body.permissao}
		if (resultado.permissao === 5) {
			resultado.id = tokenVerificado.body.id
		}
		return resposta.status(200).json(resultado)
		} catch(erro) {
			let resultado = {permissao : 0}
			return resposta.status(200).json(resultado)
		}

}

module.exports = verificarTokenFront
