const bancoDeDados = require('../bancoDeDados/index')

/**
* Repositório de funções de acesso ao banco de dados de horarios de permanência
* @namespace HorariosRepositorio
*/

const HorariosRepositorio = {
    inserir: async function (diaDaSemana, idMembro, entrada, saida) {
		await bancoDeDados.query(`INSERT INTO "horarios"("id_membro", "entrada", "saida", "dia") 
      	VALUES (${idMembro}, '${entrada}','${saida}', '${diaDaSemana}');`)
    	return true
    },

    remover: async function (id) {
        await bancoDeDados.query(`DELETE from "horarios" WHERE "id_membro" = ${id};`)
    },

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

    buscarMembro: async function (idMembro) {
        const resultado = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "id_membro" = ${idMembro};`)
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
        const resultado = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "dia" = '${valor_dia}' 
            AND "entrada" = '${valor_entrada}' AND "id_membro" = '${valor_id}';`)
        return resultado.rows[0]
    },
}

module.exports = HorariosRepositorio