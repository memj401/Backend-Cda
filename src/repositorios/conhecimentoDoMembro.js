const bancoDeDados = require('../bancoDeDados/index')

/**
* Repositório de funções de acesso ao banco de dados de conhecimentos
* @namespace conhecimentoDoMembroRepositorio
*/

const ConhecimentoDoMembroRepositorio = {
  /**
  * Associa um determinado conhecimento a um membro, além do nível de proficiência
  * @memberof conhecimentoDoMembroRepositorio
  * @async
  * @method inserir
  * @parameter {Integer} idMembro - identificador numérico do membro
  * @parameter {Integer} idConhecimento - identificador numérico do conhecimento
  * @parameter {String} nivel - nível de proficiência do membro naquele conhecimento.
  * Divide-se entre "iniciante", "intermediário" e "avançado"
  * @returns {Boolean} Retorna verdadeiro com intuito de explicitar o fim do método
  */
	inserir: async function (idMembro,idConhecimento, nivel) {
		await bancoDeDados.query(`INSERT INTO "relacao_membros_conhecimentos"("id_membro", "id_conhecimento", "nivel") 
      	VALUES (${idMembro}, ${idConhecimento},'${nivel}');`)
    	return true
	},
  /**
  * Remove uma determinada associação entre membro e conhecimento
  * @memberof conhecimentoDoMembroRepositorio
  * @async
  * @method remover
  * @parameter {Integer} idMembro - identificador numérico do membro
  * @parameter {Integer} idConhecimento - identificador numérico do conhecimento
  * @returns {Boolean} Retorna verdadeiro com intuito de explicitar o fim do método
  */
	remover: async function (idMembro, idConhecimento) {
    await bancoDeDados.query(`DELETE FROM "relacao_membros_conhecimentos" 
      WHERE "id_membro" = ${idMembro} AND "id_conhecimento" = ${idConhecimento}`)
    return true
	},
  /**
  * Altera o nivel de proficiência de determinado membro em determinado conteúdo
  * @memberof conhecimentoDoMembroRepositorio
  * @async
  * @method editar
  * @parameter {Integer} idMembro - identificador numérico do membro
  * @parameter {Integer} idConhecimento - identificador numérico do conhecimento
  * @parameter {String} nivel - nível de proficiência do membro naquele conhecimento
  * Divide-se entre "iniciante", "intermediário" e "avançado"
  * @returns {String} Retorna o novo nível de proficiência do membro
  */
  editar: async function (idMembro,idConhecimento, nivel) {
    const resultado = await bancoDeDados.query(`UPDATE "relacao_membros_conhecimentos" SET "nivel" = '${nivel}'
      WHERE id_membro = ${idMembro} AND id_conhecimento = ${idConhecimento} RETURNING "nivel"`)
    return resultado.rows[0].nivel
  },
  /**
  * Busca uma determinada associação entre membro e conhecimento
  * @memberof conhecimentoDoMembroRepositorio
  * @async
  * @method buscar
  * @parameter {Integer} idMembro - identificador numérico do membro
  * @parameter {Integer} idConhecimento - identificador numérico do conhecimento
  * @returns {Object} Retorna as informações da associação
  */  
  buscar: async function (idMembro, idConhecimento) {
    const resultado = await bancoDeDados.query(`SELECT * FROM "relacao_membros_conhecimentos" 
      WHERE id_membro = ${idMembro} AND id_conhecimento = ${idConhecimento}`)
    return resultado.rows[0]
  }
}

module.exports = ConhecimentoDoMembroRepositorio