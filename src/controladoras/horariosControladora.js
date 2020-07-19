const horariosRepositorio = require('../repositorios/horarioDoMembro')
const membroRepositorio = require('../repositorios/membro')
const bancoDecronograma = require('../bancoDeDados')

/**
    * Controladora de funções envolvendo horários de permanência de membros
    * @namespace horariosControladora
*/

const HorariosControladora = {

    listarTodos: async function(requisicao, resposta) {
        const horarios = await horariosRepositorio.buscarTudo()

        if (horarios.length == 0) {
            return resposta.status(404).json({erro: 'Não Há Horários No Banco de Dados'})
        }

        return resposta.status(200).json(horarios)
    },

    inserir: async function(requisicao, resposta){
        const cronograma = requisicao.body

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
        return resposta.status(201).json({Resultado :'Membros Inseridos Com Sucesso'})
    },

/*    editar: async function(requisicao, resposta) {
        const idMembro = requisicao.params.id_membro 
        const cronograma = requisicao.body
        horarioEntrada = cronograma.entrada
        dia = cronograma.dia

        const somenteDigitosEntrada = /^\d+$/.test(horarioEntrada)
        
        if (!horarioEntrada || !dia) {
            return resposta.status(400).json({erro: 'Requisição Incompleta'})
        }

        const membroExiste = await membroRepositorio.buscarUm(idMembro)

        if(!membroExiste){
            return resposta.status(404).json({erro: 'Membro Não Existente na Tabela de Membros'})
        }

        testeMembro = await horariosRepositorio.checarMembro(idMembro)

        if(!testeMembro){
            return resposta.status(404).json({erro: 'Membro Não Registrado Nos Horários'})
        }

        if(!somenteDigitosEntrada){
            return resposta.status(400).json({erro: 'Horário de Entrada Inválido'})
        } 

        idHorario = await horariosRepositorio.buscarIdHorario(dia, horarioEntrada)

        if(!idHorario){
            return resposta.status(404).json({erro: 'Horário Não Existente'})
        }
    
        const horarioAtualizado = await horariosRepositorio.editar(idMembro, idHorario)
        return resposta.status(200).json(await horariosRepositorio.buscarMembro(idHorario))
    },
*/

    remover: async function(requisicao, resposta) {
        await horariosRepositorio.remover()
        return resposta.status(200).json({Resultado :'Horários Dos Membros Deletados com Sucesso'})
    }
}

module.exports = HorariosControladora