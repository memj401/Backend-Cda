const bancoDeDados = require('../bancoDeDados/index')

/**
* Repositório de funções de acesso ao banco de dados de conhecimentos
* @namespace conhecimentoRepositorio
*/

const ConhecimentoRepositorio = {
  /**
  * Insere um conhecimento não catalogado no Banco de Dados, mais especificamenta na tabela de Conhecimentos
  * @memberof conhecimentoRepositorio
  * @async
  * @method inserir
  * @parameter {String} conhecimento - nome do conhecimento pelo qual será feita a inserção
  * @returns {Integer} Retorna o identificador numérico associado ao conhecimento adicionado na tabela
  */
  inserir: async function (conhecimento, descricao) {
    const resultado = await bancoDeDados.query(`INSERT INTO "conhecimentos" ("nome", "descricao") VALUES ('${conhecimento}', '${descricao}') RETURNING "id_conhecimento";`)
    return resultado.rows[0].id_conhecimento
	},
  /**
  * Remove um conhecimento catalogado no Banco de Dados, mais especificamenta na tabela de Conhecimentos
  * @memberof conhecimentoRepositorio
  * @async
  * @method remover
  * @parameter {Integer} id - identificador numérico do conhecimento
  * @returns {Boolean} Retorno verdadeiro utilizado apenas para determinar o fim da função
  */
	remover: async function (id) {
		await bancoDeDados.query(`DELETE FROM "conhecimentos" WHERE "id_conhecimento" = ${id};`)
		return true
	},
  /**
  * Busca um conhecimento catalogado no Banco de Dados, mais especificamenta na tabela de Conhecimentos
  * @memberof conhecimentoRepositorio
  * @async
  * @method buscar
  * @parameter {Integer} id- identificador numérico do conhecimento
  * @returns {Object} Retorna as informações do conhecimento buscado
  */
	buscar: async function (id) {
		const resultado = await bancoDeDados.query(`SELECT * FROM "conhecimentos" WHERE "id_conhecimento" = ${id};`)
    if (resultado.rows.length !== 0) {
      const membros = await bancoDeDados.query(`SELECT * FROM "relacao_membros_conhecimentos" 
        WHERE "id_conhecimento" = ${id}`)
      for (i = 0; i <  membros.rows.length; i++) {
        nomeConhecimento = await bancoDeDados.query(`SELECT "nome" FROM "membros" 
          WHERE id_membro = ${membros.rows[i].id_membro}`)
        membros.rows[i].nome = nomeConhecimento.rows[0].nome
        delete membros.rows[i].id_conhecimento   
      }
      resultado.rows[0].membros = membros.rows
    }
    return resultado.rows[0]
	},
  /**
  * Busca por nome  um conhecimento catalogado no Banco de Dados, mais especificamenta na tabela de Conhecimentos
  * @memberof conhecimentoRepositorio
  * @async
  * @method buscar
  * @parameter {String} nome- nome do conhecimento
  * @returns {Object} Retorna as informações do conhecimento buscado
  */
	buscarPorNome: async function (nome) {
		const resultado = await bancoDeDados.query(`SELECT * FROM "conhecimentos" WHERE "nome" = '${nome}';`)
    return resultado.rows[0]
	},
  /**
  * Busca todos os conhecimentos catalogados no Banco de Dados, mais especificamenta na tabela de Conhecimentos
  * @memberof conhecimentoRepositorio
  * @async
  * @method buscarTodos
  * @returns {Object} Retorna um array com as informações dos conhecimentos buscados
  */
	buscarTodos: async function () {
		const resultado = await bancoDeDados.query('SELECT * FROM "conhecimentos";')
		return resultado.rows
	},
  /**
  * Edita um conhecimento catalogado no Banco de Dados, mais especificamenta na tabela de Conhecimentos
  * @memberof conhecimentoRepositorio
  * @async
  * @method editar
  * @parameter {String} novoNome - nome no qual será editado o conhecimento
  * @parameter {Integer} id- identificador numérico do conhecimento
  * @returns {Object} Retorna as informações atualizadas do conhecimento 
  */
	editar: async function (dados, id) {
		const parametros = ['nome','descricao']
    let queryFinal = 'UPDATE "conhecimentos" SET '
    
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
    queryFinal += ` WHERE "id_conhecimento" = ${id} RETURNING *;`
    resultado = await bancoDeDados.query(queryFinal)
    return resultado.rows[0]
	}
}

module.exports = ConhecimentoRepositorio