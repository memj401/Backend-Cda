const chave = require('../config/autenticacao/chaveSecreta').chaveSecreta
const njwt = require('njwt')


async function verificarTokenFront (requisicao, resposta, proximo) {
	const cabecalho =  requisicao.headers.authorization
	const token = cabecalho.split(' ')[1]
			
	if (!token) {
		return resposta.status(401).json({erro: 'Token não Encontrado'})
	} 

	try {
		const tokenVerificado = njwt.verify(token, chave)
		return resposta.status(200).json({permissao: tokenVerificado.body.permissao})
	} catch(erro) {
		return resposta.status(401).json({erro: 'Não Autorizado'})
	}
}

module.exports = verificarTokenFront
