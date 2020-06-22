const bancoDeDados = require('../bancoDeDados/index')
const chave = require('../config/autenticacao/chaveSecreta').chaveSecreta
const njwt = require('njwt')

/**
*	Repositório de funções de acesso ao banco de dados de usuários
*	@namespace UsuarioRepositorio
*/
const UsuarioRepositorio = {
	/**
	*	Busca no banco de dados por dados de um usuário armazenados na sua respectiva linha e os retorna como um objeto
	*	@memberof UsuarioRepositorio
	*	@async
	*	@method buscar
	*	@parameter {String} usuario - Usuário a ser pesquisado no banco de dados
	*	@returns {Object} Uma linha da tabela com dados referentes ao usuário pesquisado
	*/
	buscar: async function (usuario) {
		const resultado = await bancoDeDados.query(`SELECT * FROM "usuarios" WHERE "nome" = '${usuario}';`)
		return resultado.rows[0]
	},
	/**
	*	Busca no banco de dados por todos os dados da tabela e os retorna como um array de objetos
	*	@memberof UsuarioRepositorio
	*	@async
	*	@method buscarTodos
	*	@returns {Array<Object>} Um array de objetos que armazenam dados de usuários
	*/
	buscarTodos: async function () {
		const resultado = await bancoDeDados.query('SELECT "nome", "permissao" FROM "usuarios";')
		return resultado.rows
	},
	/**
	*	Insere no banco de dados um usuário com os dados passados como argumento
	*	@memberof UsuarioRepositorio
	*	@async
	*	@method inserir
	*	@parameter {Object} dados - Dados do usuário a ser adicionado
	*	@parameter {String} dados.nome - Nome do usuário
	*	@parameter {String} dados.senha - Senha do usuário
	*	@parameter {String} dados.permissao - Nível de acesso do usuário
	*	@returns {Boolean} Retorno verdadeiro utilizado apenas para determinar o fim correto da função
	*/
	inserir: async function (dados) {
		await bancoDeDados.query(`INSERT INTO "usuarios" ("nome", "senha" ,"permissao") VALUES ('${dados.nome}', '${dados.senha}', ${dados.permissao});`,
			function (erro, resposta) {
			if (erro) {
				console.log(erro)
			} 
		})
		return true
	},
	/**
	*	Edita, ou substitui, conteúdo de um usuário já cadastrado no banco de dados
	*	@memberof UsuarioRepositorio
	*	@async
	*	@method editar
	*	@parameter {Object} dados - Novos dados do usuário
	*	@parameter {String} usuario - Nome do usuário a ter seu conteúdo atualizado
	*	@returns {Boolean} Retorno verdadeiro utilizado apenas para determinar o fim correto da função
	*/
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
		queryFinal += ` WHERE "nome" = '${usuario}';`
		await bancoDeDados.query(queryFinal, 
			function (erro, resposta) {
			if (erro) {
				console.log(erro)
			}
		})
		return true
	},
	/**
	*	Remove um usuário já cadastrado no banco de dados
	*	@memberof UsuarioRepositorio
	*	@async
	*	@method remover
	*	@parameter {String} usuario - Nome do usuário a ser removido
	*	@returns {Boolean} Retorno verdadeiro utilizado apenas para determinar o fim correto da função
	*/
	remover: async function (usuario) {
		await bancoDeDados.query(`DELETE from "usuarios" WHERE "nome" = '${usuario}'`,
			function (erro, resposta) {
			if (erro) {
				console.log(erro)
			}
		})
		return true
	},
	/**
	*	Alterar senha de usuário já cadastrado
	*	@memberof UsuarioRepositorio
	*	@async
	*	@method mudarSenha
	*	@parameter {String} senha - Nova senha a ser usada
	*	@parameter {String} usuario - Nome do usuário a ter sua senha alterada
	*	@returns {Boolean} Retorno verdadeiro utilizado apenas para determinar o fim correto da função
	*/
	mudarSenha: async function (senha, usuario) {
		await bancoDeDados.query(`UPDATE "usuarios" SET "senha" = '${senha}' WHERE "nome" = '${usuario}'`)
		return true
	}
}

module.exports = UsuarioRepositorio

