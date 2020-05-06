const membro = require('../repositorios/membro')
const RFid = require('../repositorios/rfid')

const pyControladora = {
    receberRFid: async function (requisicao, resposta){
        const dados = requisicao.body
        const buscarfid =  await membro.buscarUmPor("rfid",dados.rfid)
        console.log(buscarfid)
        console.log(buscarfid) // Falta analisar isso aqui
        const informaçõesDaEntrada={ 
            rfid: dados.rfid,
            valido: (buscarfid != undefined) // testar isso
        }
        RFid.adicionarEntrada(informaçõesDaEntrada)
        return resposta.status(200).end()
    },
    mandarProFront: async function (requisicao, resposta){
        const dados = await RFid.pegarUltimaEntrada()
        if (dados.valido === true) { //[1] é a coluna da validação, se o RFID for valido ou seja igual a true n pode cadastrar ele denovo
            return resposta.status(400).json({erro: "O último cartão passado ja foi cadastrado passe um cartão não cadastrado e tente novamente"})
        }
        else {
            return resposta.status(200).json(dados.rfid) // [0] é a coluna q vai ficar o RFID
        }
    },
    pegarTodoRegistro: async function (requisicao, resposta){
        const dados = RFid.mostrarTodos()
        return resposta.status(202).json(dados)
    }
}

module.exports = pyControladora
