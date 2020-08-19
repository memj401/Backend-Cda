const njwt = require('njwt')
const bcrypt = require('bcrypt')

const usuarioRepositorio = require('../repositorios/usuario')
const membroRepositorio = require('../repositorios/membro')
const chave = require('../config/autenticacao/chaveSecreta').chaveSecreta

/**
    * Controladora de funções envolvendo RFID e a requisição HTTP
    * @namespace sessãoControladora
*/

const sessaoControladora = {
  /**
      * Realiza o processo de login do usuário e gera o token JWT. 
      * Também é possível realizar login como membro
      * @memberof sessãoControladora
      * @method criar
      * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
      * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
      * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
  */
  async criar(requisicao, resposta) {
    const tipo = requisicao.body.tipo

    if(tipo === 'Usuario'){
      const nome = requisicao.body.nome
      const senha = requisicao.body.senha

      const usuarioExistente = await usuarioRepositorio.buscar(nome)

      if (!usuarioExistente) {
        return resposta.status(401).json({erro: 'Usuário não existe'})
      }

      const senhaConfere = await bcrypt.compare(senha, usuarioExistente.senha)
      
      if (!senhaConfere) {
        return resposta.status(401).json({erro: 'Senha Incorreta'})
      }

      const info = {
        emissor: 'http://localhost:3001',
        usuario: `${usuarioExistente.nome}`,
        permissao: `${usuarioExistente.permissao}`
      }
      
      const jwt = await njwt.create(info,chave)
      await jwt.setExpiration(new Date().getTime() + (5)*(60)*(60)*(1000))
      const token = await jwt.compact()

      delete usuarioExistente.senha

      return resposta.status(200).json({ usuario : usuarioExistente,token})
    }

    if(tipo === 'Membro'){
      const matricula = requisicao.body.matricula
      const senha = requisicao.body.senha
      
      const MembroExistente = await membroRepositorio.buscarUmPor('matricula',matricula)

      if (!MembroExistente) {
        return resposta.status(401).json({erro: 'Membro não existe'})
      }

      const senhaConfere = await bcrypt.compare(senha, MembroExistente.senha)
      
      if (!senhaConfere) {
        return resposta.status(401).json({erro: 'Senha Incorreta'})
      }

      const info = {
        emissor: 'http://localhost:3001',
        usuario: `${MembroExistente.nome}`,
        id: MembroExistente.id_membro,
        permissao: 5
      }
      
      const jwt = await njwt.create(info,chave)
      await jwt.setExpiration(new Date().getTime() + (5)*(60)*(60)*(1000))
      const token = await jwt.compact()

      delete MembroExistente.senha
      delete MembroExistente.cargo
      delete MembroExistente.rfid
      delete MembroExistente.id_membro
      MembroExistente.permissao = 5

      return resposta.status(200).json({ membro : MembroExistente,token})
    }
    
  }
}

module.exports = sessaoControladora