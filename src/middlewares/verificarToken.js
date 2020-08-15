const chave = require('../config/autenticacao/chaveSecreta').chaveSecreta
const njwt = require('njwt')

/** 
 * Middleware de autenticação de requisições via JWT para o Front End
 * @namespace repositorioAutenticacao
*/

/**
 * Autentica o usuario via validação e decriptação, com uma chave secreta, do JWT(Java Web Token)  
 * e repassa parao Front-End o nível de permissão do usuário
 * @memberof repositorioAutenticacaoFrontEnd
 *
 * @parameter {Object} requisicao - A requisicao com o tokes em seu cabeçalho
 * @parameter {Object} resposta - Parâmetro do retorno da função como um novo token ou erro equivalente relacionado
 * @return {Function|Error} Retorna o nível de permissão do usuário logado e seu id, caso seja um membro.
 * Se o JWT for inválido retorna um nível de permissão inválido.
 */

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
