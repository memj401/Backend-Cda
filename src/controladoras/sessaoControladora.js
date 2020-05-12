const usuarioRepositorio = require('../repositorios/usuario')
const chave = require('../config/autenticacao/chaveSecreta').chaveSecreta
const njwt = require('njwt')
const bcrypt = require('bcrypt')

const sessaoControladora = {
  async criar(requisicao, resposta) {
    const nomeDeUsuario = requisicao.body.usuario
    const senha = requisicao.body.senha

    const usuarioExistente = await usuarioRepositorio.buscar(nomeDeUsuario)

    if (!usuarioExistente) {
      return resposta.status(401).json({erro: 'Usuario não existe'})
    }
    const senhaConfere = await bcrypt.compare(senha, usuarioExistente.senha)
    
    if (!senhaConfere) {
      return resposta.status(401).json({erro: 'Senha Incorreta'})
    }

    const info = {
			emissor: 'http://localhost:3001',
			usuario: `${requisicao.usuario}`,
			permissao: `${requisicao.permissao}`
		}
		const jwt = await njwt.create(info,chave)
		//await jwt.setExpiration(new Date().getTime() + 15000)
		const token = await jwt.compact()

    delete usuarioExistente.senha

    return resposta.status(200).json({ usuario : usuarioExistente,token})
  }
}

module.exports = sessaoControladora