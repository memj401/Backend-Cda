const bancoDeDados = require('../bancoDeDados/index')

painelDeControleRepositorio = {
	
	buscarTodos: async function () {
		const resultado = await bancoDeDados.query(`SELECT * FROM "painel_de_controle" ORDER BY "data" DESC,"hora" DESC;`)
		const dataFormatada = await bancoDeDados.query(`SELECT "hora", TO_CHAR("data", 'dd/mm/yyyy') 
            FROM "painel_de_controle" ORDER BY "data" DESC,"hora" DESC;`)
		resultado.rows.forEach( function(elemento, indice) {
			elemento.data = dataFormatada.rows[indice].to_char
		});
		return resultado.rows
	}
}

module.exports = painelDeControleRepositorio