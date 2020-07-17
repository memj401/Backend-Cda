const bancoDeDados = require('../bancoDeDados/index')
const ejs = require('ejs');
const puppeteer = require('puppeteer-core');

async function historico(){ //ou semanal sei la
    const historico = await bancoDeDados.query(`SELECT * FROM "rfid_acesso" ORDER BY "data" DESC,"horario" DESC;`).catch(erro => console.log(erro))
    const datasFormatadas = await bancoDeDados.query(`SELECT "horario", TO_CHAR("data", 'dd/mm/yyyy') 
        FROM "rfid_acesso" ORDER BY "data" DESC,"horario" DESC;`)
    for (var i = 0; i < historico.rows.length; i++) {
        historico.rows[i].data = datasFormatadas.rows[i].to_char
    }
    return historico.rows
}

async function fazerhtml(){
    const tabela = await historico()
    ejs.renderFile("../relatorios/template.ejs", {tabela:tabela},async (erro,html) => {
        if (erro){
            console.log(erro)
        }
        else {
            console.log(html)
            const browser = await puppeteer.launch({executablePath:'/usr/bin/chromium-browser'})
            const page = await browser.newPage()
            await page.setContent(html)
            const pdf = await page.pdf({path:"./pdfteste.pdf"})
        }
    })
}

fazerhtml()
