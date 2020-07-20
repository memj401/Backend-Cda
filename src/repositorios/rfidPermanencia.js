const bancoDeDados = require('../bancoDeDados/index')

/**
    * Repositório de funções do banco de dados do RFID de começo e fim do horário de permanência
    * @namespace repositorioPermanencia
*/

const rfidPermanencia = {
    inserirEntrada: async function(nome){
        await bancoDeDados.query(`INSERT INTO "rfid_permanencia" ("nome","data","entrada","valido") 
            VALUES ('${nome}', CURRENT_DATE, LOCALTIME, ${valido});`)
    },

    inserirSaida: async function(nome){
        await bancoDeDados.query(`UPDATE "rfid_permanencia" SET "saida"  = LOCALTIME WHERE "nome" = '${nome}' AND "data" = CURRENT_DATE;`)
    },

    buscarUm: async function(nome){
        const busca = await bancoDeDados.query(`SELECT * FROM "rfid_permanencia" 
            WHERE "nome" = '${nome}' AND "data" BETWEEN CURRENT_DATE AND CURRENT_DATE;`)
        console.log(busca.rows)
        if (busca) {
            return busca.rows[0]
        }
        return false
    },

    buscarTodos: async function(){
        const historico = await bancoDeDados.query(`SELECT * FROM "rfid_permanencia" ORDER BY "data" DESC,"entrada" DESC;`)
        const datasFormatadas = await bancoDeDados.query(`SELECT "entrada", TO_CHAR("data", 'dd/mm/yyyy') 
            FROM "rfid_permanencia" ORDER BY "data" DESC,"entrada" DESC;`)
        for (var i = 0; i < historico.rows.length; i++) {
            historico.rows[i].data = datasFormatadas.rows[i].to_char
        }
        return historico.rows
    },
    
    gerarRelatorio: async function(){ //ou semanal sei la
        const tabela = await this.buscarTodos()
        ejs.renderFile("../relatorios/template.ejs", {tabela:tabela},async (erro,html) => {
            if (erro){
                console.log(erro)
            }
            else {
                const browser = await puppeteer.launch({executablePath:'/usr/bin/chromium-browser'})
                const page = await browser.newPage()
                await page.setContent(html)
                const pdf = await page.pdf({path:"./relatorioPermanenciaTeste.pdf"})
                await browser.close();
            }
        })
        //olhar o repositorio de acessos
    }
}

module.exports = rfidPermanencia
