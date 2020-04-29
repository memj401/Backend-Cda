const chave = require('../config/autenticacao/chaveSecreta').chaveSecreta
const njwt = require('njwt')


async function middlewareAutenticacao (requisicao, resposta, proximo) {
const cabecalho =  requisicao.headers.authorization
const token = cabecalho.split(' ')[1]
		
if (!token) {
	return resposta.status(401).json({erro: 'Token não Encontrado'})
} 

try {
	const tokenVerificado = njwt.verify(token, chave)
	requisicao.permissao = tokenVerificado.body.permissao
	return proximo()
} catch(erro) {
	if (erro.message === 'Jwt is expired') {
		const novoJwt = njwt.create(erro.parsedBody, chave)
		//await novoJwt.setExpiration(new Date().getTime() + 15000)
		const novoToken = novoJwt.compact()
		return resposta.status(401).json({token: novoToken})
	} else {
		console.log(erro)
		return resposta.status(401).json({erro: 'Token JWT Inválido'})
	}
}

}

module.exports = middlewareAutenticacao
