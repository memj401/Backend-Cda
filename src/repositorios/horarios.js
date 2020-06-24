const bancoDeDados = require('../bancoDeDados/index')

/**
* Repositório de funções de acesso ao banco de dados de horarios de permanência
* @namespace HorariosRepositorio
*/

const HorariosRepositorio = {
    inserir: async function (diaDaSemana, idMembro, entrada, saida) {
		await bancoDeDados.query(`INSERT INTO "horarios"("id_membro", "entrada", "saida", "dia_da_semana") 
      	VALUES (${idMembro}, ${entrada},'${saida}', '${diaDaSemana}');`,
      	function (erro, resposta) {
        	if (erro) {
          	console.log(erro)
        	}
      	})
    	return true
    },

    remover: async function (id) {
        await bancoDeDados.query(`DELETE from "horarios" WHERE "id_membro" = ${id};`, 
        function  (erro, resposta) {
            if (erro) {
            console.log(erro)
            }
        })
    },

    editar: async function (dados, id)  {
        const parametros = ['diaDaSemana','entrada','saida']
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
//       for( i=0; i<resultado.length; ++i){
//           const nomes = await bancoDeDados.query(`SELECT * FROM "membros" WHERE "id_membro" = ${resultado.rows[0].id};`)
//            
//       }
        
        return resultado.rows[0]
    },

    buscarTodos: async function(parametro, valor) {
        let resultado;
        if (parametro && valor) {
            if (parametro === 'dia_da_semana') {
                resultado = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "${parametro}" ILIKE '${valor}%';`)
            } else {
                resultado = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "${parametro}" = '${valor}';`)
            }
        } else {
            resultado = await bancoDeDados.query('SELECT * FROM "horarios";')
        }
        return resultado.rows
    },

    buscarHora: async function (valor_dia, valor_entrada) {
        const resultado = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "dia_da_semana" = '${valor_dia}' AND "entrada" = '${valor_entrada}';`)
        return resultado.rows[0]
    },

    buscarValidacao: async function (valor_dia, valor_entrada, valor_id) {
        const resultado = await bancoDeDados.query(`SELECT * FROM "horarios" WHERE "dia_da_semana" = '${valor_dia}' AND "entrada" = '${valor_entrada}' AND "id_membro" = '${valor_id}';`)
        return resultado.rows[0]
    },

}