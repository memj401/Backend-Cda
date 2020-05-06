const bancoDeDados = require('../bancoDeDados/index')

const RFid = {
    pegarUltimaEntrada: async function() {
        const resultado = await bancoDeDados.query(`SELECT * FROM "rfidlog" ORDER BY "horario" DESC LIMIT 1;`) //Ordena todos os elementos por ordem de horario decrescente e pega 1 elemento 
        return (resultado.rows[0])
    },
    adicionarEntrada: async function(dados){ // Coloca no banco de dados toda vez q alguem passa um cartão no leitor
        await bancoDeDados.query(`INSERT INTO "rfidlog" ("rfid","valido","horario") VALUES ( '${dados.rfid}', ${dados.valido}, current_timestamp);`,
        function (erro,resposta) {
            if (erro) {
                console.log(erro)
            }
        })
    },
    mostrarTodos: async function(){ // Pra poder mostrar o histórico de entradas na sede com horários
        const resultado = await bancoDeDados.query(`SELECT * FROM "rfid";`)
        return resultado.rows
    },
    removerUltimoMes: 3 //Pra n ficar guardando dados desnecessários
}

module.exports = RFid
