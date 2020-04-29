const bancoDeDados = require('../bancoDeDados/index')
const chave = require('../config/autenticacao/chaveSecreta').chaveSecreta
const njwt = require('njwt')


const UsuarioRepositorio = {
	
	buscar: async function (usuario) {
		const resultado = await bancoDeDados.query(`SELECT * FROM "usuarios" WHERE "usuario" = '${usuario}';`)
		return resultado.rows[0]
	},

	buscarTodos: async function () {
		const resultado = await bancoDeDados.query('SELECT "usuario", "permissao" FROM "usuarios";')
		return resultado.rows
	},

	inserir: async function (dados) {
		await bancoDeDados.query(`INSERT INTO "usuarios" ("usuario", "senha" ,"permissao") VALUES ('${dados.usuario}', '${dados.senha}', ${dados.permissao});`,
			function (erro, resposta) {
			if (erro) {
				console.log(erro)
			} 
		})
		return true
	},

	editar: async function (dados, usuario) {
		const parametros = ['usuario','permissao']
		let queryFinal = 'UPDATE "usuarios" SET '
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
		queryFinal += ` WHERE "usuario" = '${usuario}';`
		await bancoDeDados.query(queryFinal, 
			function (erro, resposta) {
			if (erro) {
				console.log(erro)
			}
		})
		return true
	},

	remover: async function (usuario) {
		await bancoDeDados.query(`DELETE from "usuarios" WHERE "usuario" = '${usuario}'`,
			function (erro, resposta) {
			if (erro) {
				console.log(erro)
			}
		})
		return true
	}
}

module.exports = UsuarioRepositorio

