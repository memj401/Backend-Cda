const bancoDeDados = require('../bancoDeDados/index')
const ejs = require('ejs');
const puppeteer = require('puppeteer-core');
const glob = require('glob');

async function historico(){ //ou semanal sei la
    const arquivos = await glob.sync("*.pdf", {cwd:"../relatorios/Acessos"})
    const relatorios = arquivos.map((arquivo)=>{
        return {arquivo:arquivo, href:`../../cda-interno-backend/src/relatorios/Acessos/${arquivo}`}
    })
    return relatorios
}

async function fazerhtml(){
    const teste = await historico()
    console.log(teste)
}

fazerhtml()
