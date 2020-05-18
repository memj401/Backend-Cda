const membroRepositorio = require('../repositorios/membro')
const rfidRepositorio = require('../repositorios/rfid')
/**
    * Controladora de funções envolvendo RFID e a requisição HTTP
    * @namespace pyControladora
*/
const pyControladora = {
    /**
        * Lida com a requisição POST recebendo o valor do rfid e colocando no banco de dados
        * @memberof pyControladora
        * @method receber
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do obejto "resposta"
    */
    receber: async function (requisicao, resposta){
        const dados = requisicao.body
        const buscaRfid =  await membroRepositorio.buscarUmPor("rfid",dados.rfid)
        const informaçõesDaEntrada={ 
            rfid: dados.rfid,
            valido: (buscaRfid != undefined) // testar isso
        }
        rfidRepositorio.inserir(informaçõesDaEntrada)
        return resposta.status(200).end()
    },
    /**
        * Lida com requisição GET respondendo com a entrada mais recente do banco de dados
        * @memberof pyControladora
        * @method buscarUltimo
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do obejto "resposta"
    */
    buscarUltimo: async function (requisicao, resposta){
        const dados = await rfidRepositorio.buscarUltima()
        if (dados.valido === true) { //[1] é a coluna da validação, se o RFID for valido ou seja igual a true n pode cadastrar ele denovo
            return resposta.status(400).json({erro: "O último cartão passado ja foi cadastrado passe um cartão não cadastrado e tente novamente"})
        }
        else {
            return resposta.status(200).json(dados.rfid) // [0] é a coluna q vai ficar o RFID
        }
    },
    /**
        * Lida com requisição GET respondendo com um vetor com todas as entradas ordenadas de mais recente pra menos recente
        * @memberof pyControladora
        * @method listarTodos
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do obejto "resposta"
    */
    listarTodos: async function (requisicao, resposta){
        const dados = rfidRepositorio.buscarTodos()
        return resposta.status(200).json(dados)
    }
}

module.exports = pyControladora
