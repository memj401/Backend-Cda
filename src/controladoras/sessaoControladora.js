const njwt = require('njwt')
const bcrypt = require('bcrypt')

const usuarioRepositorio = require('../repositorios/usuario')
const chave = require('../config/autenticacao/chaveSecreta').chaveSecreta

/**
    * Controladora de funções envolvendo RFID e a requisição HTTP
    * @namespace sessãoControladora
*/

const sessaoControladora = {
  /**
      * Lida com a requisição POST recebendo informações de login de um usuário e criando uma sessão(enviando os tokens necessários para realizar operações no resto do servidor), caso o usuário não exista ou a senha esteja incorreta retorna um erro(401)
      * @memberof sessãoControladora
      * @method criar
      * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
      * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
      * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
  */
  async criar(requisicao, resposta) {
    const nomeDeUsuario = requisicao.body.nome
    const senha = requisicao.body.senha

    const usuarioExistente = await usuarioRepositorio.buscar(nomeDeUsuario)

    if (!usuarioExistente) {
      return resposta.status(401).json({erro: 'Usuário não existe'})
    }

    const senhaConfere = await bcrypt.compare(senha, usuarioExistente.senha)
    
    if (!senhaConfere) {
      return resposta.status(401).json({erro: 'Senha Incorreta'})
    }

    const info = {
			emissor: 'http://localhost:3001',
			usuario: `${nomeDeUsuario}`,
			permissao: `${usuarioExistente.permissao}`
    }
    
		const jwt = await njwt.create(info,chave)
		//await jwt.setExpiration(new Date().getTime() + 15000)
		const token = await jwt.compact()

    delete usuarioExistente.senha

    return resposta.status(200).json({ usuario : usuarioExistente,token})
  }
}

module.exports = sessaoControladora