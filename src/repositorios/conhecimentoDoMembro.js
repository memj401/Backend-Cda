const bancoDeDados = require('../bancoDeDados/index')

const ConhecimentoDoMembroRepositorio = {
	inserir: async function (idMembro,idConhecimento, nivel) {
		await bancoDeDados.query(`INSERT INTO "relacao_membros_conhecimentos"("id_membro", "id_conhecimento", "nivel") 
      	VALUES (${idMembro}, ${idConhecimento},'${nivel}');`)
    	return true
	},

	remover: async function (idMembro, idConhecimento) {
    await bancoDeDados.query(`DELETE FROM "relacao_membros_conhecimentos" 
      WHERE "id_membro" = ${idMembro} AND "id_conhecimento" = ${idConhecimento}`)
    return true
	},

  editar: async function (idMembro,idConhecimento, nivel) {
    const resultado = await bancoDeDados.query(`UPDATE "relacao_membros_conhecimentos" SET "nivel" = '${nivel}'
      WHERE id_membro = ${idMembro} AND id_conhecimento = ${idConhecimento} RETURNING "nivel"`)
    return resultado.rows[0].nivel
  },

  buscar: async function (idMembro, idConhecimento) {
    const resultado = await bancoDeDados.query(`SELECT * FROM "relacao_membros_conhecimentos" 
      WHERE id_membro = ${idMembro} AND id_conhecimento = ${idConhecimento}`)
    return resultado.rows[0]
  }
}

module.exports = ConhecimentoDoMembroRepositorio