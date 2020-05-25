const membroRepositorio = require('../repositorios/membro')

/**
    * Controladora de funções envolvendo informações sobre os membros e a requisição HTTP
    * @namespace membroControladora
*/

const MembroControladora = {
  listarTodos: async function(requisicao, resposta) {
    const membros = await membroRepositorio.buscarTodos()
    
    if (membros.length === 0) {
       return resposta.status(404).json({erro: 'Não Há Membros no Banco de Dados'})
    } 

    return resposta.status(200).json(membros)
  },

  listar: async function (requisicao, resposta) {
    const valor = requisicao.body.valor
    const parametro = requisicao.params.parametro
    
    if (!valor) {
      return resposta.status(400).json({erro: 'Sem Valor de Busca'})
    }

    if (parametro !== 'cargo' && parametro !== 'matricula' && parametro !== 'nome') {
      return resposta.status(400).json({erro: 'Tipo de Busca Inválido'})
    } 

    const membros = await membroRepositorio.buscarTodos(parametro,valor)
    
    if (membros.length === 0) {
      return resposta.status(404).json({erro : 'Não foram encontrados membros'})
    }

    return resposta.status(200).json(membros)
  },

  buscar: async function (requisicao, resposta) {
    const idMembro = requisicao.params.id
    const membro = await membroRepositorio.buscarUm(idMembro)
    
    if (!membro) {
      return resposta.status(404).json({erro :'Membro não Encontrado' })
    }
    
    const conhecimentos = await membroRepositorio.listarConhecimentos(idMembro)
    for (i = 0; i <  conhecimentos.length; i++) {
      conhecimentos[i].conhecimento = await membroRepositorio.buscarNomeConhecimento(conhecimentos[i].id_conhecimento)
      delete conhecimentos[i].id_membro
      delete conhecimentos[i].id_conhecimento 
    }

    membro.conhecimentos = conhecimentos
    return resposta.status(200).json(membro)
  },

  inserir: async function (requisicao, resposta) {
    const dados = requisicao.body
    const somenteDigitosMatricula = /^\d+$/.test(dados.matricula) //Checa se o campo da matrícula tem somente dígitos
    const somenteDigitosRfid = /^\d+$/.test(dados.rfid)          //Checa se o campo do rfid tem somente dígitos
    
    
    if (!dados.nome || !dados.cargo || !dados.matricula || !dados.rfid) {
      return resposta.status(400).json({erro : 'Estão Faltando Campos'})
    }

    if (dados.matricula.length !== 9 || !somenteDigitosMatricula) {
      return resposta.status(400).json({erro : 'Matrícula Inválida'})
    }

    if (dados.rfid.length !== 5 || !somenteDigitosRfid) {
      return resposta.status(400).json({erro : 'RFID Inválido'})
    }
    
    const matriculaJaExiste = await membroRepositorio.buscarUmPor('matricula', dados.matricula)
    const rfidJaExiste = await membroRepositorio.buscarUmPor('rfid', dados.rfid)
      
    if (matriculaJaExiste) {
      return resposta.status(400).json({erro : 'Matrícula Já Cadastrada'})
    } 

    if (rfidJaExiste) {
      return resposta.status(400).json({erro: 'RFID Já Cadastrado'})
    }

    await membroRepositorio.inserir(dados)
    const membroInserido = await membroRepositorio.buscarUmPor('matricula', dados.matricula)
    return resposta.status(201).json(membroInserido)
  },
  
  editar: async function(requisicao, resposta) {
    const idMembro = requisicao.params.id 
    const dados = requisicao.body
    const somenteDigitosMatricula = /^\d+$/.test(dados.matricula) 
    const somenteDigitosRfid = /^\d+$/.test(dados.rfid)          

    const membroExistente = await membroRepositorio.buscarUm(idMembro)
    
    if (Object.keys(dados).length === 0) {
       return resposta.status(404).json({erro: 'Requisição Vazia'})
    }

    if (!membroExistente) {
      return resposta.status(404).json({erro: 'Membro não encontrado'})
    } 

    if (dados.matricula || dados.matricula === 0) {
      
      if (dados.matricula.length !== 9 || !somenteDigitosMatricula) {
        return resposta.status(400).json({erro : 'Matrícula Inválida'})
      }
      
      const matriculaJaExiste = await membroRepositorio.buscarUmPor('matricula', dados.matricula)
      
      if (matriculaJaExiste) {   
        return resposta.status(400).json({erro : 'Matrícula Já Cadastrada'})
      }  
    } 
    
    if (dados.rfid || dados.rfid === 0) {
      if (dados.rfid.length !== 5 || !somenteDigitosRfid) {
        return resposta.status(400).json({erro : 'RFID Inválido'})
      }
      
      const rfidJaExiste = await membroRepositorio.buscarUmPor('rfid', dados.rfid)
      
      if (rfidJaExiste) { 
        return resposta.status(400).json({erro : 'RFID Já Cadastrado'})
      }
    
    }

    const membroAtualizado = await membroRepositorio.editar(dados, idMembro)
    return resposta.status(200).json(membroAtualizado)
  },

  remover: async function (requisicao, resposta) {
    const idMembro = requisicao.params.id
    const membroExiste = await membroRepositorio.buscarUm(idMembro)
   
   if (!membroExiste) {
      return resposta.status(404).json({erro : 'Membro Não Encontrado'})
    }

    await membroRepositorio.remover(idMembro)
    return resposta.status(200).json({Resultado :'Membro Deletado com Sucesso'})
  },

  inserirConhecimentoDoMembro: async function (requisicao, resposta) {
    const idMembro = requisicao.params.id
    const corpo = requisicao.body
    const conhecimento = corpo.conhecimento
    const nivel = corpo.nivel
    const membroExiste = await membroRepositorio.buscarUm(idMembro)
    let idConhecimento = await membroRepositorio.buscarIdConhecimento(conhecimento)

    if (!membroExiste) {
      return resposta.status(404).json({erro : 'Membro Não Encontrado'})
    }

    if (nivel !== 'iniciante' &&  nivel !== 'intermediario' &&  nivel !== 'avancado') {
      return resposta.status(400).json({erro : 'Nivel de Conhecimento Inválido'})
    }
    
    if (!idConhecimento) {
      idConhecimento = await membroRepositorio.inserirConhecimento(conhecimento)
      await membroRepositorio.inserirConhecimentoDoMembro(idMembro,idConhecimento,nivel)
    } else {
      const conhecimentoRepetido = await membroRepositorio.verficarConhecimentoRepetido(idMembro, idConhecimento)
      if (conhecimentoRepetido) {
        return resposta.status(400).json({erro : 'Membro Já Possui Este Conhecimento'})
      }
      await membroRepositorio.inserirConhecimentoDoMembro(idMembro,idConhecimento,nivel)
    }
    
    return resposta.status(200).json(corpo)
  }
}

module.exports = MembroControladora