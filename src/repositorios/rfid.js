onst bancoDeDados = require('../bancoDeDados/index')

const RFid = {
    pegarUltimaEntrada: async function() {
        const resultado = await bancoDeDados.query(`SELECT * FROM "rfid" ORDER BY "horario" DESC LIMIT 1;`) //Ordena todos os elementos por ordem de horario decrescente e pega 1 elemento 
        return (resultado.rows)
    },
    adicionarEntrada: async function(dados){ // Coloca no banco de dados toda vez q alguem passa um cartão no leitor
        await bancoDeDados.query(`INSERT INTO "rfid" ("rfid","horario","valido") VALUES ( '${dados.rfid}', '${dados.horario}', '${dados.valido}');`,
        function (erro,resposta) {
            if (erro) {
                console.log(erro)
            }
        })
    },
    mostrarTodos: async function(){ // Pra poder mostrar o histórico de entradas na sede com horários
        await bancoDeDados.query(`SELECT * FROM "rfid" ...;`)
    },
    removerUltimoMes: 3 //Pra n ficar guardando dados desnecessários
}

module.exports = RFid
