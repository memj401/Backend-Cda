const bancoDeDados = require('../bancoDeDados/index')
const ejs = require('ejs');
const puppeteer = require('puppeteer-core');
const glob = require('glob');

/**
* Repositóriodo Painel de Controle
* @namespace painelDeControleRepositorio
*/

painelDeControleRepositorio = {
/**
  * Insere uma entrada no Painel de Controle, denotado alguma alteração no CdA
  * @memberof painelDeControleRepositorio
  * @async
  * @method inserir
  * @parameter {String} usuario - usuário que realizou a alteração
  * @parameter {String} alteracao - tipo de alteracao realizada pelo usuário
  * @returns {Object} Retorna as informações do membro desejado
  */
    inserir: async function (usuario, alteracao) {
    const queryEntradaMaisAntiga = await (await bancoDeDados.query(`SELECT "data" FROM "painel_de_controle" ORDER BY "data" ASC,"hora" DESC LIMIT 1;`)).rows[0]
    const entradaMaisAntiga = queryEntradaMaisAntiga.data.toString().split('GMT')[0] 
    const diasDesdeUltimoRelatorio = await (await bancoDeDados.query(`SELECT (CURRENT_DATE - '${entradaMaisAntiga}') AS DAYS;`)).rows[0].day
    if (diasDesdeUltimoRelatorio > 30){
        await this.gerarRelatorio()
    }
    await bancoDeDados.query(`INSERT INTO "painel_de_controle" ("data", "hora","usuario","alteracao")
        VALUES (CURRENT_DATE, CURRENT_TIME, '${usuario}','${alteracao}');`)
    return true
    },
	buscarTodos: async function () {
		const resultado = await bancoDeDados.query(`SELECT * FROM "painel_de_controle" ORDER BY "data" DESC,"hora" DESC;`)
		const dataFormatada = await bancoDeDados.query(`SELECT "hora", TO_CHAR("data", 'dd/mm/yyyy') 
            FROM "painel_de_controle" ORDER BY "data" DESC,"hora" DESC;`)
		resultado.rows.forEach( function(elemento, indice) {
			elemento.data = dataFormatada.rows[indice].to_char
		});
		return resultado.rows
	},
/**
  * Gera um pdf com todas as entradas do painel de Controle
  * @memberof painelDeControleRepositorio
  * @async
  * @method gerarRelatorio
  */
	gerarRelatorio: async function(){
        const tabela = await this.buscarTodos()
        const entradaMaisRecente = tabela[0]
        const entradaMaisAntiga = tabela[tabela.length-1]
        ejs.renderFile("../relatorios/templateControle.ejs", {tabela:tabela},async (erro,html) => {
            if (erro){
                console.log(erro)
            }
            else {
                const browser = await puppeteer.launch({executablePath:'/usr/bin/chromium-browser'})
                const page = await browser.newPage()
                await page.setContent(html)
                const pdf = await page.pdf({path:`../relatorios/Controle/PainelDeControleDe${entradaMaisAntiga.data}Ate${entradaMaisRecente.data}.pdf`})
                await browser.close();
            }
        })
        await bancoDeDados.query(`DELETE FROM "painel_de_controle"`)
    },
/**
  * Lista os pdf's anteriormente gerados pelo painel de controle
  * @memberof painelDeControleRepositorio
  * @async
  * @method listarRelatorios
  * @returns {Array} Retorna um lista dos pdf's gerados anteriormente
  */    
    listarRelatorios: async function(){
        const arquivos = await glob.sync("*.pdf", {cwd:"./src/relatorios/Controle"})
        const relatorios = await arquivos.map((arquivo)=>{
            return {arquivo:arquivo, rota:`/relatorios/antigos/controle/${arquivo}`}
        })
        return relatorios
    }
}

module.exports = painelDeControleRepositorio