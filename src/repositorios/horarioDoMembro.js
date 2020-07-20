const bancoDeDados = require('../bancoDeDados/index')
const HorariosControladora = require('../controladoras/horariosControladora')

/**
* Repositório de funções de acesso ao banco de dados de horarios de permanência
* @namespace HorarioDoMembro
*/

const HorarioDoMembro = {
    inserir: async function (horarios) {

        for(let diaChave in horarios){
            const dia = horarios[diaChave]

            for(let horaChave in dia){
                const hora = dia[horaChave]

                for(let membro of hora.membros){
                    idMembro = membro.idMembro
                    idHorario = await HorarioDoMembro.buscarIdHorario(diaChave,horaChave)

                    await bancoDeDados.query(`INSERT INTO "relacao_membros_horarios"("id_membro","id_horario")
                    VALUES(${idMembro}, ${idHorario});`)
                }
            }
        }
        return true
    },

    buscarIdHorario: async function (dia,horarioEntrada){
        id = await bancoDeDados.query(`SELECT  * FROM "horarios" WHERE "dia" = '${dia}' AND "entrada" = '${horarioEntrada}';`)
        if (id.rows.length !== 0) {
            return id.rows[0].id_horario
        }
        return false
    },

    buscarMembro: async function (idHorario){
        id = await bancoDeDados.query(`SELECT "id_membro" FROM "relacao_membros_horarios" WHERE "id_horario" = ${idHorario}`)
        let grupo  = []
        let bloco = {idHorario: idHorario}
        for(i=0;i<id.rows.length;i++){
            aux = await bancoDeDados.query(`SELECT "nome","id_membro" FROM "membros" WHERE "id_membro" = ${id.rows[i].id_membro}`)
            const membro = {nome : aux.rows[0].nome, idMembro : aux.rows[0].id_membro}
            grupo[i] = membro
        }
        bloco.membros = grupo
        return bloco
    },

    checarMembro: async function(idMembro){
        id = await bancoDeDados.query(`SELECT "id_membro" FROM "relacao_membros_horarios" WHERE "id_membro" = ${idMembro};`)
        if (id.rows.length !== 0) {
            return id.rows[0].id_membro 
        }
        return false
    },

    buscarTudo: async function (){
        const lista = await bancoDeDados.query(`SELECT * FROM "horarios"`)
        var dados = {}
        var horario = {}
        for(i = 0; i <lista.rows.length; i++){
            let dia = lista.rows[i].dia
            let hora = lista.rows[i].entrada
            horario[hora] = {}
            dados[dia] = {...horario}
        }
        for (j = 0; j < lista.rows.length; j++) {
            let dia = lista.rows[j].dia
            let hora = lista.rows[j].entrada
            dados[dia][hora] = await this.buscarMembro(lista.rows[j].id_horario)
        }

        return dados
    },

    remover: async function (){
        await bancoDeDados.query(`DELETE FROM "relacao_membros_horarios";`)       
        return null
    },

    buscarHorarioDoMembro: async function (idMembro) {
        const idHorario = await bancoDeDados.query(`SELECT "id_horario" FROM "relacao_membros_horarios" WHERE "id_membro" = ${idMembro}';`)
        const horario = await bancoDeDados.query(`SELECT  * FROM "horarios" WHERE "id_horario" = ${idHorario.rows[0].id_horario}';`)

        return horario.rows[0]
    }
}

module.exports = HorarioDoMembro