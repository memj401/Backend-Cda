const bancoDeDados = require('../bancoDeDados/index')

/**
* Repositório de funções de acesso ao banco de dados de horarios de permanência
* @namespace HorarioDoMembro
*/

const HorarioDoMembro = {
    inserir: async function (idMembro, idHorario) {
		await bancoDeDados.query(`INSERT INTO "relacao_membros_horarios"("id_membro","id_horario");`)
    	return true
    },

    remover: async function (idHorario) {
        await bancoDeDados.query(`DELETE from "relacao_membros_horarios" WHERE "id_horario" = ${idHorario};`)
    },

    buscarIdHorario: async function (Dia,HorarioEntrada){
        id = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "dia" = '${Dia}' AND WHERE "entrada" = '${HorarioEntrada}';`)
        return id.rows[0].id_horario
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

/**    buscarTudo: async function (){
        lista = await bancoDeDados.query(`SELECT * FROM "horarios"`)
        for( i=0; i<lista.length; i++){
            dados.dia = lista.rows[i].dia
            dados.dia.entrada = lista.rows[i].entrada
            dados.dia.saida = lista.rows[i].saida
            nomes = pegarMembro(lista.rows[i].id_horario)
            for( j=0; j<nomes.length; j++){
                dados.dia.entrada.nome = nomes[j]
            }
        }
        return dados
    },
*/
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

//-----------------------DAQUI PRA BAIXO TA TUDO ERRADO------------------------------//
//-----------------------DAQUI PRA BAIXO TA TUDO ERRADO------------------------------//
//-----------------------DAQUI PRA BAIXO TA TUDO ERRADO------------------------------//
//-----------------------DAQUI PRA BAIXO TA TUDO ERRADO------------------------------//

    editar: async function (dados, id)  {
        const parametros = ['dia','entrada','saida']
        let queryFinal = 'UPDATE "horarios" SET '
        let parametroAnteriorFoiAtualizado = false
        
        for (i = 0; i < parametros.length; ++i) {
            if (dados[parametros[i]]) {
                if (parametroAnteriorFoiAtualizado) {
                    queryFinal += ', '
                }
                queryFinal += `"${parametros[i]}" = '${dados[parametros[i]]}'`
                parametroAnteriorFoiAtualizado = true
            }
        }
        queryFinal += ` WHERE "id_membro" = ${id} RETURNING *;`
        const resultado = await bancoDeDados.query(queryFinal)
        return resultado.rows[0]
    },

    buscarUmPor: async function (parametro, valor) {
        const resultado = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "${parametro}" = '${valor}';`)
            for( i=0; i<resultado.rows.length; ++i){
                const aux = await bancoDeDados.query(`SELECT * FROM "membros" WHERE "id_membro" = ${resultado.rows[0].id};`)
                resultado.rows[i].nome = aux.row[0].nome
            }
        return resultado.rows[0]
    },

    buscarTodos: async function(parametro, valor) {
        let resultado;
        if (parametro && valor) {
            if (parametro === 'dia') {
                resultado = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "${parametro}" ILIKE '${valor}%';`)
            } else {
                resultado = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "${parametro}" = '${valor}';`)
            }
        } else {
            resultado = await bancoDeDados.query('SELECT * FROM "horarios";')
        }

        for( i=0; i<resultado.length; ++i){
            const aux = await bancoDeDados.query(`SELECT * FROM "membros" WHERE "id_membro" = ${resultado.rows[0].id};`)
            resultado.rows[i].nome = aux.row[0].nome
        }

        return resultado.rows
    },

    buscarHora: async function (valor_dia, valor_entrada) {
        const resultado = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "dia" = '${valor_dia}' AND "entrada" = '${valor_entrada}';`)
        return resultado.rows[0]
    },

    buscarValidacao: async function (valor_dia, valor_entrada, valor_id) {
        const resultado = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "dia" = '${valor_dia}' AND "entrada" = '${valor_entrada}' AND "id_membro" = '${valor_id}';`)
        return resultado.rows[0]
    },
}

module.exports = HorarioDoMembro