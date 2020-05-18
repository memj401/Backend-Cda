const bancoDeDados = require('../bancoDeDados/index')
const chave = require('../config/autenticacao/chaveSecreta').chaveSecreta
const njwt = require('njwt')


const UsuarioRepositorio = {
	
	buscar: async function (usuario) {
		const resultado = await bancoDeDados.query(`SELECT * FROM "usuarios" WHERE "nomeDeUsuario" = '${usuario}';`)
		return resultado.rows[0]
	},

	buscarTodos: async function () {
		const resultado = await bancoDeDados.query('SELECT "nomeDeUsuario", "permissao" FROM "usuarios";')
		return resultado.rows
	},

	inserir: async function (dados) {
		await bancoDeDados.query(`INSERT INTO "usuarios" ("nomeDeUsuario", "senha" ,"permissao") VALUES ('${dados.nomeDeUsuario}', '${dados.senha}', ${dados.permissao});`,
			function (erro, resposta) {
			if (erro) {
				console.log(erro)
			} 
		})
		return true
	},

	editar: async function (dados, usuario) {
		const parametros = ['nomeDeUsuario','permissao']
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
		queryFinal += ` WHERE "nomeDeUsuario" = '${usuario}';`
		await bancoDeDados.query(queryFinal, 
			function (erro, resposta) {
			if (erro) {
				console.log(erro)
			}
		})
		return true
	},

	remover: async function (usuario) {
		await bancoDeDados.query(`DELETE from "usuarios" WHERE "nomeDeUsuario" = '${usuario}'`,
			function (erro, resposta) {
			if (erro) {
				console.log(erro)
			}
		})
		return true
	},

	mudarSenha: async function (senha, usuario) {
		await bancoDeDados.query(`UPDATE "usuarios" SET "senha" = '${senha}' WHERE "nomeDeUsuario" = '${usuario}'`)
		return true
	}
}

module.exports = UsuarioRepositorio

