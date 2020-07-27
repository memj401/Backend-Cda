bancoDeDados = require('../bancoDeDados/index')

async function gerarEntradaPainelDeControle (requisicao,resposta) {
	const metodoHTTP = requisicao.method
	const url = requisicao.url
	const usuario = requisicao.usuario

	const localDaAlteracao = url.split('/')[1]

	if (metodoHTTP === 'PUT' || metodoHTTP === 'PATCH') {
		
		if (localDaAlteracao === 'usuarios' || localDaAlteracao === 'membros' || localDaAlteracao === 'conhecimentos') {
			alteracao = `Alteração de informações em ${localDaAlteracao} (${requisicao.nome})`
		} else {
			alteracao = `Alteração de informações em ${localDaAlteracao}`
		}
	}

	if (metodoHTTP === 'POST') {
		
		if (localDaAlteracao === 'usuarios' || localDaAlteracao === 'membros' || localDaAlteracao === 'conhecimentos') {
			alteracao = `Inserção de informações em ${localDaAlteracao} (${requisicao.nome})`
		} else {
			alteracao = `Inserção de informações em ${localDaAlteracao}`
		}
	}

	if (metodoHTTP === 'DELETE') {
		
		if (localDaAlteracao === 'usuarios' || localDaAlteracao === 'membros' || localDaAlteracao === 'conhecimentos') {
			alteracao = `Remoção de informações em ${localDaAlteracao} (${requisicao.nome})`
		} else {
			alteracao = `Remoção de informações em ${localDaAlteracao}`
		}
	}

	await bancoDeDados.query(`INSERT INTO "painel_de_controle" ("data", "hora","usuario","alteracao")
		VALUES (CURRENT_DATE, CURRENT_TIME, '${usuario}','${alteracao}');`)
	return true
}

module.exports = gerarEntradaPainelDeControle