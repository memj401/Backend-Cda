const bancoDeDados = require('../bancoDeDados/index')

/**
    * Repositório de funções do banco de dados do RFID
    * @namespace repositorioRfid
*/

const rfid = {
    /**
        * Busca a entrada mais recente no banco de dados
        * @memberof repositorioRfid
        * @method buscarUltima
        * @returns {Object} Uma linha da tabela com os dados da entrada mais recente
    */
    buscarUltima: async function() {
        const resultado = await bancoDeDados.query(`SELECT * FROM "rfidlog" ORDER BY "horario" DESC LIMIT 1;`)
        return (resultado.rows[0])
    },
    /**
        *Insere uma entrada no banco de dados
        * @memberof repositorioRfid
        * @method inserir
        * @param {Object} dados Um objeto que contém os dados necessários para criar a entrada no banco de dados
        * @param {String} dados.rfid Uma string contendo o valor o código do rfid formatado adequadamente
        * @param {Boolean} dados.valido Um booleano que indica se o cartão é valido ou não 
    */
    inserir: async function(dados){
        await bancoDeDados.query(`INSERT INTO "rfidlog" ("nome","rfid","valido","data","horario") 
            VALUES ('${dados.nome}', '${dados.rfid}', ${dados.valido}, CURRENT_DATE, LOCALTIME);`,
        function (erro,resposta) {
            if (erro) {
                console.log(erro)
            }
        })
    },
    /**
        * Busca todas as entradas do banco de dados em ordem da mais recente para menos recente
        * @memberof repositorioRfid
        * @method buscarTodos
        * @returns {Array} Um array de objetos contendo todas as linhas da tabela
    */
    buscarTodos: async function(){
        const historico = await bancoDeDados.query(`SELECT * FROM "rfidlog" ORDER BY "data" DESC,"horario" DESC;`)
        const datasFormatadas = await bancoDeDados.query(`SELECT "horario", TO_CHAR("data", 'dd/mm/yyyy') 
            FROM "rfidlog" ORDER BY "data" DESC,"horario" DESC;`)
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

module.exports = rfidAcesso
