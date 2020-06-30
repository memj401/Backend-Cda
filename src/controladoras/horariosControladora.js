const horariosRepositorio = require('../repositorios/horarios')
const membroRepositorio = require('../repositorios/membro')

/**
    * Controladora de funções envolvendo horários de permanência de membros
    * @namespace horariosControladora
*/

const HorariosControladora = {

    listarTodos: async function(requisicao, resposta) {
        const horarios = await horariosRepositorio.buscarTodos()

        if (horarios.length === 0) {
            return resposta.status(404).json({erro: 'Não há horários no Banco de Dados'})
        }

        return resposta.status(200).json(horarios)
    },

    listar: async function (requisicao, resposta) {
        const valor = requisicao.body.valor
        const parametro = requisicao.params.parametro

        if(!valor){
            return resposta.status(404).json({erro: 'Valor de Busca Inválida'})
        }

        if(parametro !== 'dia' && parametro !== 'entrada' && parametro !== 'saida' && parametro !== 'id_membro'){
            return resposta.status(404).json({erro: 'Parâmetro de Busca Inválida'})
        }

        const horarios = await horariosRepositorio.buscarTodos(parametro,valor)
        
        if(horarios === 0){
            return resposta.status(404).json({erro: 'Não foram encontrados membros'})
        }
        return resposta.status(200).json(horarios)
    },

    inserir: async function(requisicao, resposta){
        const dados = requisicao.body
        const somenteDigitosEntrada = /^\d+$/.test(dados.entrada)
        const somenteDigitosSaida = /^\d+$/.test(dados.saida)

        if(!dados.id_membro|| !dados.entrada || !dados.saida || !dados.dia){
            return resposta.status(404).json({erro: 'Número Inválido de Campos de Entrada'})
        }

        if(!somenteDigitosEntrada || !somenteDigitosSaida){
            return resposta.status(404).json({erro: 'Dado(s) de Entrada Numérica Inválido(s)'})
        }

        const idJaExiste = await horariosRepositorio.buscarMembro(dados.id_membro)
        const horarioOcupado = await horariosRepositorio.buscarHora(dados.dia, dados.entrada) 

        if(idJaExiste){
            return resposta.status(404).json({erro: 'Membro Já Registrado'})
        }

        if(horarioOcupado){
            return resposta.status(404).json({erro: 'Horário Já Ocupado'})
        }

        await horariosRepositorio.inserir(dados.dia, dados.id_membro, dados.entrada, dados.saida)
        const horarioInserido = await horariosRepositorio.buscarValidacao(dados.dia, dados.entrada, dados.id_membro)

        return resposta.status(201).json(horarioInserido)
    },

    editar: async function(requisicao, resposta) {
        const idMembro = requisicao.params.id 
        const dados = requisicao.body
        const somenteDigitosEntrada = /^\d+$/.test(dados.entrada)
        const somenteDigitosSaida = /^\d+$/.test(dados.saida)  
    
        const idJaExiste = await horariosRepositorio.buscarMembro(idMembro)
        
        if (Object.keys(dados).length === 0) {
            return resposta.status(404).json({erro: 'Requisição Vazia'})
        }
    
        if (!idJaExiste) {
            return resposta.status(404).json({erro: 'Membro não encontrado'})
        }
    
        if (dados.id_membro === 0) {
            if (!somenteDigitosEntrada) {
                return resposta.status(400).json({erro : 'Horário de Entrada Inválido'})
            }
            if (!somenteDigitosSaida) {
                return resposta.status(400).json({erro : 'Horário de Saída Inválido'})
            }
          
            const horaJaExiste = await membroRepositorio.buscarHora(dados.dia, dados.entrada)
          
            if (horaJaExiste) {   
                return resposta.status(400).json({erro : 'Horário de Entrada Já Ocupado'})
            }
        }
    
        const horarioAtualizado = await horariosRepositorio.editar(dados, idMembro)
        return resposta.status(200).json(horarioAtualizado)
    },

    remover: async function(requisicao, resposta) {
        const idMembro = requisicao.params.id 
        const dados = requisicao.body
        const horarioExiste = await horariosRepositorio.buscarMembro(idMembro)
        
        if(!horarioExiste){
            return resposta.status(404).json({erro: 'Membro Não Encontrado'})
        }

        await horariosRepositorio.remover(idMembro)
        return resposta.status(200).json({Resultado :'Horário Deletado com Sucesso'})
    }
}

module.exports = HorariosControladora