const membroRepositorio = require('../repositorios/membro')
const acessoRepositorio = require('../repositorios/rfidAcesso')
const permanenciaRepositorio = require('../repositorios/rfidPermanencia')
const horarioRepositorio = require('../repositorios/horarioDoMembro')
/**
    * Controladora de funções envolvendo RFID e a requisição HTTP
    * @namespace eletronicaControladora
*/

const eletronicaControladora = {
    /**
        * Lida com a requisição post recebendo o valor do rfid e colocando no banco de dados
        * @memberof eletronicaControladora
        * @method receberAcesso
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
    receberAcesso: async function (requisicao, resposta){
        const dados = requisicao.body
        const buscaRfid =  await membroRepositorio.buscarUmPor("rfid",dados.rfid)
        const informaçõesDaEntrada={ 
            rfid: dados.rfid,
            valido: (buscaRfid != undefined), // testar isso
            nome: (buscaRfid !=undefined) ? buscaRfid.nome : "Cartão Inválido"
        }
        acessoRepositorio.inserir(informaçõesDaEntrada)
        return resposta.status(200).end()
    },
    receberPermanencia: async function (requisicao, resposta){
        const dados = requisicao.body
        const buscaMembro = await membroRepositorio.buscarUmPor("rfid",dados.rfid)
        if (buscaMembro == undefined){
            return resposta.status(400).json({erro: "O cartão é inválido"})
        }
        const horarioAtual = new Date()
        const horarioDoMembro = await horarioRepositorio.buscarHorarioDoMembro(buscaMembro.id)
        const verificarEntrada = await permanenciaRepositorio.buscarUm(buscaMembro.nome)
        if(verificarEntrada){
            if(horarioAtual.getHours() - horarioDoMembro.saida >= 0){
                const valido = true
                await permanenciaRepositorio.inserirSaida(buscaMembro.nome, valido)
            }
            else if(horarioAtual.getHours - horarioDoMembro == -1) {
                if(horarioAtual.getMinutes()<50){
                    const valido = false
                    await permanenciaRepositorio.inserirSaida(buscaMembro.nome, valido)
                } 
                else{
                    const valido = true
                    await permanenciaRepositorio.inserirSaida(buscaMembro.nome, valido)
                }
            }
            else{
                const valido = false
                await permanenciaRepositorio.inserirSaida(buscaMembro.nome,valido)
            }
        }
        else{
            if(horarioAtual.getHours() - horarioDoMembro.entrada>0){
                const valido = false
                await permanenciaRepositorio.inserirEntrada(buscaMembro.nome, valido)
            }
            else if(horarioAtual.getHours() - horarioDoMembro.entrada==0){
                if(horarioAtual.getMinutes()>10){
                    const valido = false
                    await permanenciaRepositorio.inserirEntrada(buscaMembro.nome, valido)
                }
                else{
                    const valido = true
                    await permanenciaRepositorio.inserirEntrada(buscaMembro.nome, valido)
                }
            }
            else{
                const valido = true
                await permanenciaRepositorio.inserirEntrada(buscaMembro.nome, valido)
            }
        }
        return resposta.status(200).end()
    },
    /**
        * Lida com requisição GET respondendo com a entrada mais recente do banco de dados
        * @memberof eletronicaControladora
        * @method buscarParaCadastro
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
    buscarParaCadastro: async function (requisicao, resposta){
        const dados = await acessoRepositorio.buscarUltima()
        if (dados.valido === true) { //[1] é a coluna da validação, se o RFID for valido ou seja igual a true n pode cadastrar ele denovo
            return resposta.status(400).json({erro: "O último cartão passado ja foi cadastrado passe um cartão não cadastrado e tente novamente"})
        }
        else {
            return resposta.status(200).json(dados.rfid) // [0] é a coluna q vai ficar o RFID
        }
    },
    listarPermanencias: async function (requisição,resposta){
        const dados = await permanenciaRepositorio.buscarTodos()
        return resposta.status(200).json(dados)
    },
    //listarPermanenciasAntigas
    /**
        * Lida com requisição GET respondendo com um vetor com todas as entradas ordenadas de mais recente pra menos recente
        * @memberof eletronicaControladora
        * @method listarAcessos
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
    listarAcessos: async function (requisicao, resposta){
        const dados = await acessoRepositorio.buscarTodos()
        return resposta.status(200).json(dados)
    },
    listarAcessosAntigos: async function (requisicao, resposta){
        const dados = await acessoRepositorio.listarRelatorios()
        return resposta.status(200).json(dados)
    }
}

module.exports = eletronicaControladora
