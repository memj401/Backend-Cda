const bancoDeDados = require('../bancoDeDados/index')

/**
    * Repositório de funções do banco de dados do RFID de começo e fim do horário de permanência
    * @namespace repositorioPermanencia
*/

const rfidPermanencia = {
    inserirEntrada: async function(nome){
        await bancoDeDados.query(`INSERT INTO "rfid_permanencia" ("nome","data","entrada") 
            VALUES ('${nome}', CURRENT_DATE, LOCALTIME);`)
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
    }//,
    // relatorioMensal: async function(){ //ou semanal sei la
    //     var doc = new jsPDF();

    //     var tabela = document.getElementById(tabelaID);
    //     var hoje = new Date();
    //     var dd = hoje.getDate();
    //     var mm = hoje.getMonth() + 1;
    //     var yyyy = hoje.getFullYear();
    //     if (dd < 10) dd = '0' + dd;
    //     if (mm < 10) mm = '0' + mm;
    //     hoje = dd + '-' + mm + '-' + yyyy
    //     var nome = tabelaID + '-' + hoje;
    //     //cabeçalho

    //     var header = function (data) {
    //         var img = new Image()
    //         if (window.location.href.indexOf('relatorios') >= 0) {
    //             img.src = ('../assets/mecajun_logo_pdf.png');
    //         } 
    //         else {
    //             img.src = ('./assets/mecajun_logo_pdf.png');
    //         }
    //         var imgOffset = (doc.internal.pageSize.width - 50) / 2;
    //         doc.addImage(img, 'png', imgOffset, 20, 50, 25);
    //     }
    //     // Título do Documento

    //     doc.setFont('Times New Roman');
    //     doc.setFontSize(18);
    //     doc.setTextColor(24, 109, 105);
    //     doc.setFontType("bold");
    //     var hoje_titulo = dd + '/' + mm + '/' + yyyy
    //     var titulo = tabela.childNodes[1].innerHTML + ' de ' + tabela.childNodes[1].id + ' até ' + hoje_titulo
    //     var textWidth = doc.getStringUnitWidth(titulo) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    //     var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    //     doc.text(textOffset, 52, titulo)
    //     // Tabela

    //     doc.autoTable({ didDrawPage: header, margin: { top: 57 }, html: '#' + tabela.childNodes[3].id })
    //     doc.save(nome + '.pdf');
    // } //Pra n ficar guardando dados desnecessários
}

module.exports = rfidPermanencia
