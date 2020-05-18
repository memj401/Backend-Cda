const fs = require('fs')

const bancoDeDados = require('../../bancoDeDados/index')

async function criarTabelas () {
	console.log('Criando..')

	const sqlScripts = fs
	.readdirSync(__dirname)
	.filter(script => script.startsWith('tabela_'))

	for (let i = 0; i < sqlScripts.length; i++) {
		let script = sqlScripts[i]

		console.log(script)
		
		const query = fs
		.readFileSync(`${__dirname}/${script}`)
		.toString()

		resultado = await bancoDeDados.query(query)

		console.log("- Feito!")
	}
	console.log('Criação de Tabelas Completa!')
}

async function criar() {
	await criarTabelas()
	bancoDeDados.end()
}


criar()