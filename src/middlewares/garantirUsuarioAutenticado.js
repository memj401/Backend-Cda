const chave = require('../config/autenticacao/chaveSecreta').chaveSecreta
const njwt = require('njwt')

/** 
 * Espaço da função de autenticação de requisições via JWT
 * @namespace repositorioAutenticacao
*/

/**
 * Autentica o usuario via validação e decriptação, com uma chave secreta, do JWT(Java Web Token) 
 * e repassa a requisição para a função 'proximo' que encaminha a requisição para os serviços do banco de dados
 * @memberof repositorioAutenticacao
 *
 * @param      {Object}    requisicao  A requisicao com o tokes em seu cabeçalho
 * @param      {Object}    resposta    Parâmetro do retorno da função como um novo token ou erro equivalente relacionado
 * @param      {Function}  proximo     A função que encaminhará a requisição para os serviçoes do banco de dados
 * @return     {Function|Error} Retorna a função proximo ou erro da resposta
 */

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
