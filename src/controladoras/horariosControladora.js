const horariosRepositorio = require('../repositorios/horarioDoMembro')
const membroRepositorio = require('../repositorios/membro')

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
        const dados = requisicao.body
        const idMembro = dados.id_membro
        const horarioEntrada = dados.entrada
        const dia = dados.dia

        function somenteDigitosEntrada(vetor){
           return /^\d+$/.test(vetor)
        }

        if(!idMembro || !horarioEntrada || !dia){
            return resposta.status(400).json({erro: 'Número Inválido de Campos de Entrada'})
        }

        if(!somenteDigitosEntrada(idMembro)){
            return resposta.status(400).json({erro: 'Novo Id de Membro Inválido'})
        }

        if(!somenteDigitosEntrada(horarioEntrada)){
            return resposta.status(400).json({erro: 'Dado de Entrada Numérica Inválido'})
        }
        
        const membroExiste = await membroRepositorio.buscarUm(idMembro)
        
        if(!membroExiste){
            return resposta.status(404).json({erro: 'Membro Não Existente na Tabela de Membros'})
        }

        const testeMembro = await horariosRepositorio.checarMembro(idMembro)

        if(testeMembro){
            return resposta.status(400).json({erro: 'Membro Já Registrado em outro horário'})
        }

        idHorario = await horariosRepositorio.buscarIdHorario(dia, horarioEntrada) 

        if(!idHorario){
            return resposta.status(404).json({erro: 'Horário Não Existente'})
        }

        await horariosRepositorio.inserir(idMembro, idHorario)
        return resposta.status(201).json(await horariosRepositorio.buscarMembro(idHorario))
    },

    editar: async function(requisicao, resposta) {
        const idMembro = requisicao.params.id_membro 
        const dados = requisicao.body
        horarioEntrada = dados.entrada
        dia = dados.dia

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

    remover: async function(requisicao, resposta) {
        const dados = requisicao.body
        dia = dados.dia
        horarioEntrada = dados.entrada
        const somenteDigitosEntrada = /^\d+$/.test(horarioEntrada)
        
        if(!somenteDigitosEntrada){
            return resposta.status(400).json({erro: 'Horário de Entrada Inválido'})
        }
        
        idHorario = await horariosRepositorio.buscarIdHorario(dia, horarioEntrada) 

        if(idHorario == 0){
            return resposta.status(404).json({erro: 'Horário Não existente'})
        }

        await horariosRepositorio.remover(idHorario)
        return resposta.status(200).json({Resultado :'Membros do Horário Deletados com Sucesso'})
    }
}

module.exports = HorariosControladora