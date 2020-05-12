const membroRepositorio = require('../repositorios/membro')

const MembroControladora = {
  listarTodos: async function(requisicao, resposta) {
    const membros = await membroRepositorio.buscarTodos()
    
    if (!membros) {
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
    const membroId = requisicao.params.id
    const resultado = await membroRepositorio.buscarUm(membroId)

    if (!resultado) {
      return resposta.status(404).json({erro :'Membro não Encontrado' })
    }

    return resposta.status(200).json(resultado)
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
    const membroId = requisicao.params.id 
    const dados = requisicao.body
    const somenteDigitosMatricula = /^\d+$/.test(dados.matricula) 
    const somenteDigitosRfid = /^\d+$/.test(dados.rfid)          

    const membroExistente = await membroRepositorio.buscarUm(membroId)
    
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

    await membroRepositorio.editar(dados, membroId)
    const membroAtualizado = await membroRepositorio.buscarUm(membroId)
    return resposta.status(200).json(membroAtualizado)
  },

  remover: async function (requisicao, resposta) {
    const membroId = requisicao.params.id
    const membroExiste = await membroRepositorio.buscarUm(membroId)
   
   if (!membroExiste) {
      return resposta.status(400).json({erro : 'Membro Não Encontrado'})
    }

    await membroRepositorio.remover(membroId)
    return resposta.status(200).json({Resultado :'Membro Deletado com Sucesso'})
  }
}

module.exports = MembroControladora