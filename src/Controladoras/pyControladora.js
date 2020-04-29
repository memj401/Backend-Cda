const membro = require('../repositorios/membro')
const RFid = require('../repositorios/rfid')

const pyControladora = {
    receberRFid: async function (requisicao, resposta){
        const dados = requisicao.body
        const data = Date()
        const buscarfid = membro.buscarUmPor("rfid",dados.rfid) // Falta analisar isso aqui
        const informaçõesDaEntrada={ 
            rfid: dados.rfid,
            horario: data.getTime(),
            valido: (buscarfid!=undefined) // testar isso
        }
        RFid.adicionarEntrada(informaçõesDaEntrada)
        return resposta.status(200).end()
    },
    mandarProFront: async function (requisicao, resposta){
        const dados = RFid.pegarUltimaEntrada()
        if (dados[x]===true) { //ainda n sei em q coluna vai ficar a validação, se o RFID for valido ou seja igual a true n pode cadastrar ele denovo
            return resposta.status(400).json({erro: "O último cartão passado ja foi cadastrado passe um cartão não cadastrado e tente novamente"})
        }
        else {
            return resposta.status(200).json(dados[y]) // ainda n sei em q coluna vai ficar o RFID
        }
    }
}

module.exports = pyControladora
