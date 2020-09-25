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
        * Busca a entrada mais recente na tabela de acessos do banco de dados
        * @memberof repositorioAcesso
        * @async
        * @method buscarUltima
        * @returns {Object} Retorna a informações da última entrada na tabela de acessos
    */
    buscarUltima: async function() {
        const resultado = await bancoDeDados.query(`SELECT * FROM "rfid_acesso" ORDER BY "data" DESC,"horario" DESC LIMIT 1;`)
        return (resultado.rows[0])
    },
    /**
        *Insere uma entrada na tabela de acessos do banco de dados
        * @memberof repositorioAcesso
        * @async
        * @method inserir
        * @param {Object} dados -  Um objeto que contém os dados necessários para criar a entrada no banco de dados
        * @param {String} dados.rfid - Uma string contendo o valor o código do rfid formatado adequadamente
        * @param {Boolean} dados.valido - Um booleano que indica se o cartão é valido ou não 
    */
    inserir: async function(dados){
        const queryEntradaMaisAntiga = await (await bancoDeDados.query(`SELECT "data" FROM "rfid_acesso" ORDER BY "data" ASC,"horario" DESC LIMIT 1;`)).rows[0]
        if(queryEntradaMaisAntiga){
           const entradaMaisAntiga = queryEntradaMaisAntiga.data.toString().split('GMT')[0] 
           const diasDesdeUltimoRelatorio = await (await bancoDeDados.query(`SELECT (CURRENT_DATE - '${entradaMaisAntiga}') AS DAYS;`)).rows[0].day
           if (diasDesdeUltimoRelatorio > 30){
               await this.gerarRelatorio()
            }
        }
        await bancoDeDados.query(`INSERT INTO "rfid_acesso" ("nome","rfid","valido","data","horario")
            VALUES ('${dados.nome}', '${dados.rfid}', ${dados.valido}, CURRENT_DATE, LOCALTIME);`)
    },
    /**
        * Busca todas as entradas da tabela de acessos em ordem da mais recente para menos recente
        * @memberof repositorioAcesso
        * @method buscarTodos
        * @returns {Array} Um array de objetos contendo todas as informações da tabela
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
/**
  * Gera um pdf com todas as entradas da Tabela de Acessos
  * @memberof repositorioAcesso
  * @async
  * @method gerarRelatorio
  */
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
/**
  * Lista os pdf's anteriormente gerados pelo controle de acesso
  * @memberof repositorioAcesso
  * @async
  * @method listarRelatorios
  * @returns {Array} Retorna um lista dos pdf's gerados anteriormente
  */     
    listarRelatorios: async function(){
        const arquivos = await glob.sync("*.pdf", {cwd:"./src/relatorios/Acessos"})
        const relatorios = await arquivos.map((arquivo)=>{
            return {arquivo:arquivo, rota:`/relatorios/antigos/acessos/${arquivo}`}
        })
        return relatorios
    }
}

module.exports = rfidAcesso
