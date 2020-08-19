const membroRepositorio = require('../repositorios/membro')
const acessoRepositorio = require('../repositorios/rfidAcesso')
const permanenciaRepositorio = require('../repositorios/rfidPermanencia')
const horarioRepositorio = require('../repositorios/horarioDoMembro')
const path = require('path')

/**
    * Controladora de funções envolvendo RFID e a requisição HTTP
    * @namespace eletronicaControladora
*/

const eletronicaControladora = {
    /**
        * Insere um Entrada na tabela de Acessos do RFID
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
            valido: (buscaRfid != undefined),
            nome: (buscaRfid !=undefined) ? buscaRfid.nome : "Cartão Inválido"
        }
        acessoRepositorio.inserir(informaçõesDaEntrada)
        return resposta.status(200).end()
    },
    /**
        * Insere um Entrada na tabela de Permanência do RFID
        * @memberof eletronicaControladora
        * @method receberPermanencia
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Promise} O retorno nessa função é desnecessário e é feito só para não gerar confusão quanto ao fim da função, o que importa é a chamada dos metodos do objeto "resposta", essa chamada seleciona um status para o resposta e prepara o conteudo
    */
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
    /**
        * Obtém todas as entradas da tabela de Permanencia do RFID
        * @memberof eletronicaControladora
        * @method listarPermanencias
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object}  Retorna as informações retiradas da tabela
    */    
    listarPermanencias: async function (requisicao, resposta){
        const dados = await permanenciaRepositorio.buscarTodos()
        if (dados == false){
            return resposta.status(400).json({erro: "Não há entradas em Permanencias"})
        }
        return resposta.status(200).json(dados)
    },
    /**
        * Obtém a lista dos pdf's gerados anteriormente na parte de Permanência
        * @memberof eletronicaControladora
        * @method listarPermanenciasAntigas
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object}  Retorna a lista dos pdf's cadastrados
    */     
    listarPermanenciasAntigas: async function (requisicao, resposta){
        const dados = await permanenciaRepositorio.listarRelatorios()
        return resposta.status(200).json(dados)
    },
    /**
        * Obtém o pdf especificado da parte de Permanência
        * @memberof eletronicaControladora
        * @method buscarPdfPermanencia
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object}  Retorna o pdf especificado
    */      
    buscarPdfPermanencia: async function (requisicao, resposta){
        const arquivo = requisicao.params.arquivo
        return resposta.status(200).sendFile(path.resolve(`src/relatorios/Permanencia/${arquivo}`))
    },
    /**
        * Obtém todas as entradas da tabela de Acessos do RFID
        * @memberof eletronicaControladora
        * @method listarAcessos
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object} Retorna as informações retiradas da tabela
    */
    listarAcessos: async function (requisicao, resposta){
        const dados = await acessoRepositorio.buscarTodos()
        if (dados == false){
            return resposta.status(400).json({erro: "Não há entradas em Permanencias"})
        }
        return resposta.status(200).json(dados)
    },
    /**
        * Obtém a lista dos pdf's gerados anteriormente na parte de Acessos
        * @memberof eletronicaControladora
        * @method listarAcessosAntigos
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object}  Retorna a lista dos pdf's cadastrados
    */   
    listarAcessosAntigos: async function (requisicao, resposta){
        const dados = await acessoRepositorio.listarRelatorios()
        return resposta.status(200).json(dados)
    },
    /**
        * Obtém o pdf especificado da parte de Acessos
        * @memberof eletronicaControladora
        * @method buscarPdfPermanencia
        * @param {Object} requisicao Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object}  Retorna o pdf especificado
    */      
    buscarPdfAcesso: async function (requisicao, resposta){
        const arquivo = requisicao.params.arquivo
        return resposta.status(200).sendFile(path.resolve(`src/relatorios/Acessos/${arquivo}`))
    }
}

module.exports = eletronicaControladora
