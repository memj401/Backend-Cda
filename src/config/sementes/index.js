const fs = require('fs')

const bancoDeDados = require('../../bancoDeDados/index')

async function preencherTabelas () {
	console.log('Preenchendo Tabelas..')

	const sqlScripts = fs
	.readdirSync(__dirname)
	.filter(script => script.startsWith('semente_'))

	for (let i = 0; i < sqlScripts.length; i++) {
		let script = sqlScripts[i]

		console.log(script)
		
		const query = fs
		.readFileSync(`${__dirname}/${script}`)
		.toString()

		resultado = await bancoDeDados.query(query)

		console.log("- Feito!")
	}
	console.log('Todas as Tabelas Foram Preenchidas!')
}

async function preencher() {
	await preencherTabelas()
	bancoDeDados.end()
}


preencher()