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
		const permissao = tokenVerificado.body.permissao
		return resposta.status(200).json({permissao: permissao})
		} catch(erro) {
			return resposta.status(200).json({permissao: 0})
		}

}

module.exports = verificarTokenFront
