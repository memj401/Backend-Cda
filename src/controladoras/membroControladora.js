const membroRepositorio = require('../repositorios/membro')

/**
    * Controladora de funções envolvendo informações sobre os membros e a requisição HTTP
    * @namespace membroControladora
*/

const MembroControladora = {
    /**
        * Lida com a requisição GET respondendo com um vetor contendo todos os membros ou um erro(404) caso não haja membros no banco de dados
        * @memberof membroControladora
        * @method listarTodos
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
  listarTodos: async function(requisicao, resposta) {
    const membros = await membroRepositorio.buscarTodos()
    
    if (membros.length === 0) {
        return resposta.status(404).json({erro: 'Não Há Membros no Banco de Dados'})
    } 

    return resposta.status(200).json(membros)
  },
    /**
        * Lida com a requisição GET respondendo com um vetor contendo alguns membros selecionados a partir de parametros enviados na requisição ou um erro(400) caso o parametro de busca seja invalido ou um erro(404) caso não haja membros que se encaixem no parametro de busca
        * @memberof membroControladora
        * @method listar
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
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
    /**
        * Lida com requisições GET respondendo com os dados sobre um membro selecionado com base no id do membro no banco de dados ou um erro(404) caso não exista um membro com o id selecionado
        * @memberof membroControladora
        * @method buscar
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
  buscar: async function (requisicao, resposta) {
    const membroId = requisicao.params.id
    const membro = await membroRepositorio.buscarUm(membroId)
    
    if (!membro) {
      return resposta.status(404).json({erro :'Membro não Encontrado' })
    }
    
    const conhecimentos = await membroRepositorio.listarConhecimentos(membroId)
    membro.conhecimentos = conhecimentos
    return resposta.status(200).json(membro)
  },
    /**
        * Lida com requisições POST recebendo dados sobre um novo membro e colocando no banco de dados e respondendo com o status(200), caso não sejam enviadas todas as informações necessárias ou qualquer informação do membro já esteja
        * cadastrada, como rfid, matricula ou nome é enviado um erro(400) em resposta
        * @memberof membroControladora
        * @method inserir
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
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
      /**
        * Lida com requisições PUT editando uma entrada de membro no banco de dados com novos dados fornecidos, caso não sejam fornecidas informações ou o membro a ser editado não exista é enviado um erro(404),
        * caso os novos dados a serem usados já pertecerem a outro membro retorna um erro(400) 
        * @memberof membroControladora
        * @method editar
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
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
    /**
        * Lida com requisições DELETE recebendo o id de um membro e o removendo do banco de dados caso exista, caso contrário responde com um erro(404) 
        * @memberof membroControladora
        * @method remover
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
  remover: async function (requisicao, resposta) {
    const membroId = requisicao.params.id
    const membroExiste = await membroRepositorio.buscarUm(membroId)
   
   if (!membroExiste) {
      return resposta.status(404).json({erro : 'Membro Não Encontrado'})
    }

    await membroRepositorio.remover(membroId)
    return resposta.status(200).json({Resultado :'Membro Deletado com Sucesso'})
  },
    /**
        * Lida com requisições POST recebendo o id e os conhecimentos a serem adicionados ao membro e inserindo os conhecimentos no banco de dados no membro cujo id foi enviado, caso o membro não exista retorna um erro(404),
        * caso não sejam enviados todos os campos ou o campo de conhecimentos não esteja formatado adequadamente é enviado um erro(400)
        * @memberof membroControladora
        * @method inserirConhecimento
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
  inserirConhecimento: async function (requisicao, resposta) {
    const membroId = requisicao.params.id
    const dados = requisicao.body
    const membroExiste = await membroRepositorio.buscarUm(membroId)

    if (!membroExiste) {
      return resposta.status(404).json({erro : 'Membro Não Encontrado'})
    }
    if (!dados.nivel || !dados.conhecimento) {
      return resposta.status(400).json({erro : 'Estão Faltando Campos'})
    }
    if (dados.nivel !== 'iniciante' && dados.nivel !== 'intermediario' && dados.nivel !== 'avancado') {
      return resposta.status(400).json({erro : 'Nível De Conhecimento Inválido'})
    }
    await membroRepositorio.inserirConhecimento(dados, membroId)
    return resposta.status(200).json(dados)
  }
}

module.exports = MembroControladora