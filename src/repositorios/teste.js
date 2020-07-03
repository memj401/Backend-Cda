const bancoDeDados = require('../bancoDeDados/index')
const ejs = require('ejs');

async function historicoo(){ //ou semanal sei la
    const historico = await bancoDeDados.query(`SELECT * FROM "rfid_acesso" ORDER BY "data" DESC,"horario" DESC;`).catch(erro => console.log(erro))
    return historico.rows
    const datasFormatadas = await bancoDeDados.query(`SELECT "horario", TO_CHAR("data", 'dd/mm/yyyy') 
        FROM "rfid_acesso" ORDER BY "data" DESC,"horario" DESC;`)
    for (var i = 0; i < historico.rows.length; i++) {
        historico.rows[i].data = datasFormatadas.rows[i].to_char
    }
    return historico.rows
}

async function teste() {
	const historico = historicoo()
	console.log(historico)
	ejs.renderFile("../relatorios/template.ejs", {tabela:historico}, (erro,html) =>{
    	if (erro){
        	console.log(erro)
    	}
    	else {
        	console.log(html)
    	}
	})
}

teste()
