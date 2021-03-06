const horariosRepositorio = require('../repositorios/horarioDoMembro')
const membroRepositorio = require('../repositorios/membro')
const bancoDecronograma = require('../bancoDeDados')

/**
    * Controladora de funções envolvendo horários de permanência de membros
    * @namespace horariosControladora
*/

const HorariosControladora = {
     /**
        * Lista todos os horários registrados no Banco de Dados
        * @memberof HorariosControladora
        * @method listarTodos
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @returns {Object} Retorna um array com as informações de cada horario registrado 
    */
    listarTodos: async function(requisicao, resposta) {
        const horarios = await horariosRepositorio.buscarTudo()

        if (horarios.length == 0) {
            return resposta.status(404).json({erro: 'Não Há Horários No Banco de Dados'})
        }

        return resposta.status(200).json(horarios)
    },
     /**
        * Insere um horário de Permanência
        * @memberof HorariosControladora
        * @method inserir
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @param {Function} proximo - Referência para a próxima função da pilha (Gerar entrada no Painel De Controle)
        * @returns {String} Retorna uma mensagem demonstrando que a inserção foi feita
    */
    inserir: async function(requisicao, resposta, proximo){
        const cronograma = requisicao.body
        const permissaoDoUsuario = requisicao.permissao

        if (permissaoDoUsuario > 3) {
            return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
        }

        function somenteDigitosEntrada(vetor){
           return /^\d+$/.test(vetor)
        }

        if(!cronograma){
            return resposta.status(404).json({erro: 'Entrada Vazia'})
        }
        await horariosRepositorio.remover()
        for(let diaChave in cronograma){
            const dia = cronograma[diaChave]
            if(!dia){
                return resposta.status(400).json({erro: 'Formato ou Conteúdo Inválido de Entrada'})
            }

            for(let horaChave in dia){
                const hora = dia[horaChave]
                if(!hora){
                    return resposta.status(400).json({erro: 'Formato ou Conteúdo Inválido de Entrada'})
                }

                for(let membro of hora.membros){

                    idMembro = membro.idMembro

                    if(!idMembro || !diaChave || !horaChave){
                        return resposta.status(400).json({erro: 'Número Inválido de Campos de Entrada'})
                    }

                    if(!somenteDigitosEntrada(idMembro)){
                        return resposta.status(400).json({erro: 'Pelo Menos Um Novo Id de Membro Inválido'})
                    }

                    const membroExiste = await membroRepositorio.buscarUm(idMembro)
        
                    if(!membroExiste){
                        return resposta.status(404).json({erro: 'Pelo Menos Um Membro Não Existe Na Tabela de Membros'})
                    }

                    const testeMembro = await horariosRepositorio.checarMembro(idMembro)

                    if(testeMembro){
                        return resposta.status(400).json({erro: 'Houveram Múltiplas Tentativas De Inserção Do Mesmo Membro'})
                    }

                    if(!somenteDigitosEntrada(horaChave)){
                        return resposta.status(400).json({erro: 'Pelo Menos Um Dado de Entrada Numérica Inválido'})
                    }                    

                    idHorario = await horariosRepositorio.buscarIdHorario(diaChave,horaChave)

                    if(!idHorario){
                        return resposta.status(404).json({erro: 'Pelo Menos Um Horário A Inserir Não Existe'})
                    }
                }
            }
        }
        await horariosRepositorio.inserir(cronograma)
        proximo()
        return resposta.status(201).json({Resultado :'Membros Inseridos Com Sucesso'})
    },
     /**
        * Remove todos os horários de Permanência
        * @memberof HorariosControladora
        * @method remover
        * @param {Object} requisicao - Parametro padrão e fornecido pelo Express, guarda as informações da requisição como corpo e o tipo
        * @param {Object} resposta - Parametro padrão e fornecido pelo Express, guarda as informações da resposta como o corpo e o status
        * @param {Function} proximo - Referência para a próxima função da pilha (Gerar entrada no Painel De Controle)
        * @returns {String} Retorna uma mensagem demonstrando que a deleção foi feita
    */
    remover: async function(requisicao, resposta, proximo) {
        const permissaoDoUsuario = requisicao.permissao
        
        if (permissaoDoUsuario > 3) {
            return resposta.status(401).json({erro : 'Acesso Não Autorizado'})
        }

        await horariosRepositorio.remover()
        proximo()
        return resposta.status(200).json({Resultado :'Horários Dos Membros Deletados com Sucesso'})
    }
}

module.exports = HorariosControladora