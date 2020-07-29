const bancoDeDados = require('../bancoDeDados/index')
const ejs = require('ejs');
const puppeteer = require('puppeteer-core');
const glob = require('glob');
/**
    * Repositório de funções do banco de dados do RFID de acesso a porta
    * @namespace repositorioAcesso
*/

const rfidAcesso = {
    /**
        * Busca a entrada mais recente no banco de dados
        * @memberof repositorioAcesso
        * @method buscarUltima
        * @returns {Object} Uma linha da tabela com os dados da entrada mais recente
    */
    buscarUltima: async function() {
        const resultado = await bancoDeDados.query(`SELECT * FROM "rfid_acesso" ORDER BY "data" DESC,"horario" DESC LIMIT 1;`)
        return (resultado.rows[0])
    },
    /**
        *Insere uma entrada no banco de dados
        * @memberof repositorioAcesso
        * @method inserir
        * @param {Object} dados Um objeto que contém os dados necessários para criar a entrada no banco de dados
        * @param {String} dados.rfid Uma string contendo o valor o código do rfid formatado adequadamente
        * @param {Boolean} dados.valido Um booleano que indica se o cartão é valido ou não 
    */
    inserir: async function(dados){
        const queryEntradaMaisAntiga = await (await bancoDeDados.query(`SELECT "data" FROM "rfid_acesso" ORDER BY "data" ASC,"horario" DESC LIMIT 1;`)).rows[0]
        const entradaMaisAntiga = queryEntradaMaisAntiga.data.toString().split('GMT')[0] 
        const diasDesdeUltimoRelatorio = await (await bancoDeDados.query(`SELECT (CURRENT_DATE - '${entradaMaisAntiga}') AS DAYS;`)).rows[0].day
        if (diasDesdeUltimoRelatorio > 30){
            await this.gerarRelatorio()
        }
        await bancoDeDados.query(`INSERT INTO "rfid_acesso" ("nome","rfid","valido","data","horario")
            VALUES ('${dados.nome}', '${dados.rfid}', ${dados.valido}, CURRENT_DATE, LOCALTIME);`)
    },
    /**
        * Busca todas as entradas do banco de dados em ordem da mais recente para menos recente
        * @memberof repositorioAcesso
        * @method buscarTodos
        * @returns {Array} Um array de objetos contendo todas as linhas da tabela
    */
    buscarTodos: async function(){
        const historico = await bancoDeDados.query(`SELECT * FROM "rfid_acesso" ORDER BY "data" DESC,"horario" DESC;`)
        const datasFormatadas = await bancoDeDados.query(`SELECT "horario", TO_CHAR("data", 'dd/mm/yyyy') 
            FROM "rfid_acesso" ORDER BY "data" DESC,"horario" DESC;`)
        historico.rows.forEach( function(elemento, indice) {
            elemento.data = datasFormatadas.rows[indice].to_char
        });
        return historico.rows
    },
    gerarRelatorio: async function(){
        const tabela = await this.buscarTodos()
        const entradaMaisRecente = tabela[0]
        const entradaMaisAntiga = tabela[tabela.length-1]
        ejs.renderFile("../relatorios/templateAcesso.ejs", {tabela:tabela},async (erro,html) => {
            if (erro){
                console.log(erro)
            }
            else {
                const browser = await puppeteer.launch({executablePath:'/usr/bin/chromium-browser'})
                const page = await browser.newPage()
                await page.setContent(html)
                const pdf = await page.pdf({path:`../relatorios/Acessos/AcessosDe${entradaMaisAntiga.data}Ate${entradaMaisRecente.data}.pdf`})
                await browser.close();
            }
        })
        await bancoDeDados.query(`DELETE FROM "rfid_acesso"`)
    },
    listarRelatorios: async function(){
        const arquivos = await glob.sync("*.pdf", {cwd:"../relatorios/Acessos"})
        const relatorios = await arquivos.map((arquivo)=>{
            return {arquivo:arquivo, link:`../../cda-interno-backend/src/relatorios/Acessos/${arquivo}`}
        })
        return relatorios
    }
}

module.exports = rfidAcesso
