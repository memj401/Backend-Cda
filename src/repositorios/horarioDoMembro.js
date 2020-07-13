const bancoDeDados = require('../bancoDeDados/index')

/**
* Repositório de funções de acesso ao banco de dados de horarios de permanência
* @namespace HorarioDoMembro
*/

const HorarioDoMembro = {
    inserir: async function (idMembro, idHorario) {
		await bancoDeDados.query(`INSERT INTO "relacao_membros_horarios"("id_membro","id_horario")
            VALUES(${idMembro}, ${idHorario});`)
    	return true
    },

    remover: async function (idHorario) {
        await bancoDeDados.query(`DELETE from "relacao_membros_horarios" WHERE "id_horario" = ${idHorario};`)
    },

    buscarIdHorario: async function (Dia,HorarioEntrada){
        id = await bancoDeDados.query(`SELECT  * FROM "horarios" WHERE "dia" = '${Dia}' AND "entrada" = '${HorarioEntrada}';`)
        if (id.rows.length !== 0) {
            return id.rows[0].id_horario
        }
        return false
    },

    buscarMembro: async function (idHorario){
        id = await bancoDeDados.query(`SELECT "id_membro" FROM "relacao_membros_horarios" WHERE "id_horario" = ${idHorario}`)
        membro = []
        for(i=0;i<id.rows.length;i++){
            aux = await bancoDeDados.query(`SELECT "nome" FROM "membros" WHERE "id_membro" = ${id.rows[i].id_membro}`)
            membro[i] = aux.rows[0].nome
        }
        return membro
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

    editar: async function (idMembro,idHorario){
        resultado = await bancoDeDados.query(`UPDATE "relacao_membros_horarios" SET "id_horario" = ${idHorario}  WHERE "id_membro" = ${idMembro} RETURNING *`)
        return resultado.rows[0]
    }

}

module.exports = HorarioDoMembro